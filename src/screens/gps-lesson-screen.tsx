import * as Location from "expo-location"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { analyticsService } from "../services/analytics-service"

// ─── Tipos ───────────────────────────────────────────────────────────────────

type PermissionStatus = "unknown" | "granted" | "denied" | "requesting"

interface GpsData {
  latitude: number
  longitude: number
  accuracy: number | null
  altitude: number | null
  speed: number | null
  heading: number | null
  timestamp: number
}

interface Address {
  street: string | null
  district: string | null
  city: string | null
  region: string | null
  country: string | null
}

type ActiveTab = "gps" | "mapa" | "conceitos"

// ─── Constantes ──────────────────────────────────────────────────────────────

const TABS: { key: ActiveTab; label: string; icon: string }[] = [
  { key: "gps", label: "GPS", icon: "📡" },
  { key: "mapa", label: "Mapa", icon: "🗺️" },
  { key: "conceitos", label: "Conceitos", icon: "📚" },
]

const CONCEITOS = [
  {
    icon: "📡",
    title: "GPS (Global Positioning System)",
    body: "Sistema de satélites que triangula a posição do dispositivo. Usa no mínimo 4 satélites para calcular latitude, longitude e altitude.",
    color: "#007AFF",
  },
  {
    icon: "🔐",
    title: "Permissões (Foreground)",
    body: "O app só pode acessar o GPS com permissão do usuário. Foreground = apenas enquanto o app está em uso. Background = acesso contínuo (pede permissão extra).",
    color: "#FF9500",
  },
  {
    icon: "📍",
    title: "Coordenadas",
    body: "Latitude: eixo norte/sul (-90° a +90°). Longitude: eixo leste/oeste (-180° a +180°). Accuracy: precisão em metros. Ex: SP = Lat -23.55°, Lng -46.63°",
    color: "#34C759",
  },
  {
    icon: "🔄",
    title: "watchPosition",
    body: "Monitora a localização em tempo real, recebendo atualizações automáticas à medida que o dispositivo se move. Ideal para rastreamento e navegação.",
    color: "#AF52DE",
  },
  {
    icon: "🏠",
    title: "Reverse Geocoding",
    body: "Converte coordenadas (lat, lng) em um endereço legível por humanos. Usa APIs como Expo Location ou Google Geocoding para fazer a conversão.",
    color: "#FF3B30",
  },
  {
    icon: "🗺️",
    title: "react-native-maps",
    body: "Biblioteca oficial para exibir mapas no React Native. Usa Google Maps (Android/iOS) ou Apple Maps (iOS). Suporta Markers, Callouts e Polylines.",
    color: "#5856D6",
  },
]

// ─── Componente Principal ─────────────────────────────────────────────────────

export function GpsLessonScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gps")
  const [permission, setPermission] = useState<PermissionStatus>("unknown")
  const [gpsData, setGpsData] = useState<GpsData | null>(null)
  const [address, setAddress] = useState<Address | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [trackingCount, setTrackingCount] = useState(0)
  const watchRef = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {
    analyticsService.logScreenView("gps_lesson_screen")
    checkPermission()
    return () => {
      watchRef.current?.remove()
    }
  }, [])

  // ── Permissão ──────────────────────────────────────────────────────────────

  const checkPermission = async (): Promise<void> => {
    const { status } = await Location.getForegroundPermissionsAsync()
    setPermission(status === "granted" ? "granted" : "denied")
  }

  const requestPermission = async (): Promise<boolean> => {
    setPermission("requesting")
    const { status } = await Location.requestForegroundPermissionsAsync()
    const granted = status === "granted"
    setPermission(granted ? "granted" : "denied")
    if (!granted) {
      Alert.alert(
        "Permissão negada",
        "Acesse Configurações > Privacidade > Localização para habilitar.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configurações", onPress: () => Linking.openSettings() },
        ]
      )
    }
    return granted
  }

  // ── Obter posição atual ────────────────────────────────────────────────────

  const getLocation = async (): Promise<void> => {
    if (permission !== "granted") {
      const ok = await requestPermission()
      if (!ok) return
    }
    setLoadingLocation(true)
    try {
      // 📌 PASSO PRINCIPAL: getCurrentPositionAsync
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      const data: GpsData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        speed: location.coords.speed,
        heading: location.coords.heading,
        timestamp: location.timestamp,
      }
      setGpsData(data)
      await doReverseGeocode(data.latitude, data.longitude)
    } catch {
      Alert.alert("Erro", "Não foi possível obter a localização. Verifique o GPS.")
    } finally {
      setLoadingLocation(false)
    }
  }

  // ── Reverse Geocoding ──────────────────────────────────────────────────────

  const doReverseGeocode = async (lat: number, lng: number): Promise<void> => {
    setLoadingAddress(true)
    try {
      // 📌 CONCEITO: reverseGeocodeAsync – coordenadas → endereço
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
      if (results.length > 0) {
        const r = results[0]
        setAddress({
          street: r.street,
          district: r.district,
          city: r.city,
          region: r.region,
          country: r.country,
        })
      }
    } catch {
      setAddress(null)
    } finally {
      setLoadingAddress(false)
    }
  }

  // ── Rastreamento em Tempo Real ─────────────────────────────────────────────

  const toggleTracking = async (): Promise<void> => {
    if (isTracking) {
      watchRef.current?.remove()
      watchRef.current = null
      setIsTracking(false)
      return
    }
    if (permission !== "granted") {
      const ok = await requestPermission()
      if (!ok) return
    }
    setIsTracking(true)
    setTrackingCount(0)
    // 📌 CONCEITO: watchPositionAsync – localização em tempo real
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 5, // atualiza a cada 5 metros
        timeInterval: 3000,  // ou a cada 3 segundos
      },
      (location) => {
        const data: GpsData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          heading: location.coords.heading,
          timestamp: location.timestamp,
        }
        setGpsData(data)
        setTrackingCount((c) => c + 1)
      }
    )
  }

  // ── Abrir no mapa nativo ───────────────────────────────────────────────────

  const openInNativeMaps = (): void => {
    if (!gpsData) return
    const { latitude, longitude } = gpsData
    const url =
      Platform.OS === "ios"
        ? `maps://app?ll=${latitude},${longitude}&q=Minha+Localização`
        : `geo:${latitude},${longitude}?q=${latitude},${longitude}(Minha+Localização)`
    Linking.openURL(url)
  }

  // ── Render: aba GPS ────────────────────────────────────────────────────────

  const renderGpsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Card de Permissão */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔐 Passo 1 — Permissão</Text>
        <Text style={styles.sectionDesc}>
          Antes de qualquer coisa, o app precisa da permissão do usuário para acessar o GPS.
          Isso é exigido tanto no Android quanto no iOS.
        </Text>
        <View style={[styles.permBadge, { backgroundColor: permColor(permission) }]}>
          <Text style={styles.permBadgeText}>{permLabel(permission)}</Text>
        </View>
        {permission !== "granted" && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={requestPermission}
            disabled={permission === "requesting"}
          >
            <Text style={styles.btnPrimaryText}>
              {permission === "requesting" ? "Solicitando..." : "Solicitar Permissão"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card: Obter Posição */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📍 Passo 2 — Obter Posição Atual</Text>
        <Text style={styles.sectionDesc}>
          <Text style={styles.codeInline}>getCurrentPositionAsync()</Text> captura a posição
          uma única vez com alta precisão.
        </Text>
        <TouchableOpacity
          style={[styles.btnPrimary, loadingLocation && styles.btnDisabled]}
          onPress={getLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.btnPrimaryText}>
            {loadingLocation ? "Obtendo localização..." : "📡 Obter Localização"}
          </Text>
        </TouchableOpacity>

        {gpsData && (
          <View style={styles.dataGrid}>
            <DataRow icon="🌐" label="Latitude" value={gpsData.latitude.toFixed(6) + "°"} color="#007AFF" />
            <DataRow icon="🌐" label="Longitude" value={gpsData.longitude.toFixed(6) + "°"} color="#007AFF" />
            <DataRow
              icon="🎯"
              label="Precisão"
              value={gpsData.accuracy !== null ? `±${gpsData.accuracy.toFixed(0)}m` : "N/A"}
              color="#34C759"
            />
            <DataRow
              icon="⛰️"
              label="Altitude"
              value={gpsData.altitude !== null ? `${gpsData.altitude.toFixed(1)}m` : "N/A"}
              color="#FF9500"
            />
            <DataRow
              icon="💨"
              label="Velocidade"
              value={gpsData.speed !== null && gpsData.speed > 0 ? `${(gpsData.speed * 3.6).toFixed(1)} km/h` : "0 km/h"}
              color="#5856D6"
            />
            <DataRow
              icon="🧭"
              label="Direção"
              value={gpsData.heading !== null ? `${gpsData.heading.toFixed(0)}°` : "N/A"}
              color="#FF3B30"
            />
          </View>
        )}
      </View>

      {/* Card: Reverse Geocoding */}
      {gpsData && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏠 Passo 3 — Reverse Geocoding</Text>
          <Text style={styles.sectionDesc}>
            <Text style={styles.codeInline}>reverseGeocodeAsync()</Text> converte as
            coordenadas em um endereço legível.
          </Text>
          {loadingAddress ? (
            <Text style={styles.loadingText}>Buscando endereço...</Text>
          ) : address ? (
            <View style={styles.addressBox}>
              {address.street && <Text style={styles.addressLine}>🏘️ {address.street}</Text>}
              {address.district && <Text style={styles.addressLine}>🏙️ {address.district}</Text>}
              {address.city && (
                <Text style={styles.addressLine}>
                  📌 {address.city}
                  {address.region ? `, ${address.region}` : ""}
                </Text>
              )}
              {address.country && <Text style={styles.addressLine}>🌎 {address.country}</Text>}
            </View>
          ) : (
            <Text style={styles.loadingText}>Endereço não disponível</Text>
          )}
        </View>
      )}

      {/* Card: Rastreamento em Tempo Real */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔄 Passo 4 — Rastreamento em Tempo Real</Text>
        <Text style={styles.sectionDesc}>
          <Text style={styles.codeInline}>watchPositionAsync()</Text> atualiza a posição
          automaticamente conforme o dispositivo se move.
        </Text>
        <TouchableOpacity
          style={[styles.btnPrimary, isTracking ? styles.btnDanger : null]}
          onPress={toggleTracking}
        >
          <Text style={styles.btnPrimaryText}>
            {isTracking ? `⏹ Parar Rastreamento` : "▶️ Iniciar Rastreamento"}
          </Text>
        </TouchableOpacity>
        {isTracking && (
          <View style={styles.trackingBadge}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingText}>
              Ativo · {trackingCount} atualização{trackingCount !== 1 ? "ões" : ""} recebida{trackingCount !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      {/* Botão: Abrir no mapa nativo */}
      {gpsData && (
        <TouchableOpacity style={styles.btnSecondary} onPress={openInNativeMaps}>
          <Text style={styles.btnSecondaryText}>🗺️ Abrir no Maps Nativo</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  )

  // ── Render: aba Mapa ───────────────────────────────────────────────────────

  const renderMapTab = () => {
    const lat = gpsData?.latitude ?? null
    const lng = gpsData?.longitude ?? null

    // Converte coordenadas em posição relativa no grid visual (normalizado 0–1)
    const normLat = lat !== null ? Math.min(1, Math.max(0, (lat + 90) / 180)) : 0.5
    const normLng = lng !== null ? Math.min(1, Math.max(0, (lng + 180) / 360)) : 0.5

    return (
      <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Card: Visualizador de Coordenadas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🌐 Visualizador de Coordenadas</Text>
          <Text style={styles.sectionDesc}>
            Representação visual da posição no globo. O ponto azul é a sua localização atual.
          </Text>

          {/* Grade do globo */}
          <View style={styles.globe}>
            {/* Linhas de latitude */}
            {[0.25, 0.5, 0.75].map((v) => (
              <View
                key={`lat-${v}`}
                style={[styles.globeLineH, { top: `${v * 100}%` as unknown as number }]}
              />
            ))}
            {/* Linhas de longitude */}
            {[0.25, 0.5, 0.75].map((v) => (
              <View
                key={`lng-${v}`}
                style={[styles.globeLineV, { left: `${v * 100}%` as unknown as number }]}
              />
            ))}
            {/* Labels dos eixos */}
            <Text style={[styles.globeLabel, { top: 2, left: 4 }]}>N 90°</Text>
            <Text style={[styles.globeLabel, { bottom: 2, left: 4 }]}>S -90°</Text>
            <Text style={[styles.globeLabel, { top: 2, right: 4 }]}>L 180°</Text>
            <Text style={[styles.globeLabelEquator, { top: "48%" as unknown as number, left: 4 }]}>Equador</Text>

            {/* Marcador da posição */}
            {lat !== null && lng !== null && (
              <View
                style={[
                  styles.globeMarker,
                  {
                    left: `${normLng * 100}%` as unknown as number,
                    top: `${(1 - normLat) * 100}%` as unknown as number,
                  },
                ]}
              >
                <View style={styles.globeMarkerDot} />
                <View style={styles.globeMarkerPulse} />
              </View>
            )}

            {!gpsData && (
              <View style={styles.globeEmpty}>
                <Text style={styles.globeEmptyText}>
                  Obtenha sua localização na aba GPS
                </Text>
              </View>
            )}
          </View>

          {/* Coordenadas em destaque */}
          {gpsData && (
            <View style={styles.coordDisplay}>
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>LATITUDE</Text>
                <Text style={styles.coordValue}>{gpsData.latitude.toFixed(6)}°</Text>
                <Text style={styles.coordHint}>
                  {gpsData.latitude >= 0 ? "Hemisfério Norte" : "Hemisfério Sul"}
                </Text>
              </View>
              <View style={styles.coordDivider} />
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>LONGITUDE</Text>
                <Text style={styles.coordValue}>{gpsData.longitude.toFixed(6)}°</Text>
                <Text style={styles.coordHint}>
                  {gpsData.longitude >= 0 ? "Hemisfério Leste" : "Hemisfério Oeste"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Card: Abrir no mapa nativo */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {Platform.OS === "ios" ? "🍎 Apple Maps" : "🗺️ Google Maps"}
          </Text>
          <Text style={styles.sectionDesc}>
            O <Text style={styles.codeInline}>Linking.openURL()</Text> abre o app de mapas nativo
            do dispositivo passando as coordenadas via deep link.
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeBlockText}>
              {Platform.OS === "ios"
                ? `maps://app?ll={lat},{lng}&q=Eu`
                : `geo:{lat},{lng}?q={lat},{lng}(Eu)`}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.btnPrimary, !gpsData && styles.btnDisabled]}
            onPress={openInNativeMaps}
            disabled={!gpsData}
          >
            <Text style={styles.btnPrimaryText}>
              {gpsData
                ? `📍 Abrir ${Platform.OS === "ios" ? "Apple Maps" : "Google Maps"}`
                : "Obtenha sua localização primeiro"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card: Nota sobre react-native-maps */}
        <View style={[styles.sectionCard, styles.noteCard]}>
          <Text style={styles.noteTitle}>📦 react-native-maps</Text>
          <Text style={styles.noteText}>
            Para exibir um mapa interativo dentro do app, usamos a biblioteca{" "}
            <Text style={styles.codeInline}>react-native-maps</Text>. Ela já está instalada
            neste projeto, mas requer um{" "}
            <Text style={{ fontWeight: "700" }}>Development Build</Text> (não funciona no
            Expo Go, pois exige código nativo).
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeBlockText}>{"<MapView initialRegion={region}>"}</Text>
            <Text style={styles.codeBlockText}>{"  <Marker coordinate={coords} />"}</Text>
            <Text style={styles.codeBlockText}>{"</MapView>"}</Text>
          </View>
          <View style={styles.noteBuildSteps}>
            <Text style={styles.noteStepTitle}>Para usar com Development Build:</Text>
            <Text style={styles.noteStep}>1. npx expo run:ios</Text>
            <Text style={styles.noteStep}>2. npx expo run:android</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    )
  }

  // ── Render: aba Conceitos ──────────────────────────────────────────────────

  const renderConceitosTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.conceitosIntro}>
        Revise os conceitos fundamentais da aula de GPS e Mapas:
      </Text>
      {CONCEITOS.map((c, i) => (
        <View key={i} style={[styles.conceitoCard, { borderLeftColor: c.color }]}>
          <Text style={styles.conceitoIcon}>{c.icon}</Text>
          <View style={styles.conceitoBody}>
            <Text style={[styles.conceitoTitle, { color: c.color }]}>{c.title}</Text>
            <Text style={styles.conceitoText}>{c.body}</Text>
          </View>
        </View>
      ))}

      {/* Fluxo visual */}
      <View style={styles.fluxoCard}>
        <Text style={styles.fluxoTitle}>🔁 Fluxo Completo</Text>
        {[
          { step: "1", label: "requestForegroundPermissionsAsync()", desc: "Pede permissão" },
          { step: "2", label: "getCurrentPositionAsync()", desc: "Captura posição" },
          { step: "3", label: "reverseGeocodeAsync()", desc: "Converte em endereço" },
          { step: "4", label: "watchPositionAsync()", desc: "Rastreamento contínuo" },
          { step: "5", label: "<MapView> + <Marker>", desc: "Exibe no mapa" },
        ].map((f, i) => (
          <View key={i} style={styles.fluxoStep}>
            <View style={styles.fluxoBadge}>
              <Text style={styles.fluxoBadgeText}>{f.step}</Text>
            </View>
            <View style={styles.fluxoInfo}>
              <Text style={styles.fluxoCode}>{f.label}</Text>
              <Text style={styles.fluxoDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )

  // ── Render principal ───────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 GPS & Mapas</Text>
        <Text style={styles.headerSubtitle}>expo-location · react-native-maps</Text>
        <View style={styles.headerStats}>
          <StatPill
            label="Permissão"
            value={permission === "granted" ? "✓" : "✗"}
            active={permission === "granted"}
          />
          <StatPill
            label="Localização"
            value={gpsData ? "OK" : "—"}
            active={!!gpsData}
          />
          <StatPill
            label="Rastreando"
            value={isTracking ? "ON" : "OFF"}
            active={isTracking}
          />
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo das abas */}
      {activeTab === "gps" && renderGpsTab()}
      {activeTab === "mapa" && renderMapTab()}
      {activeTab === "conceitos" && renderConceitosTab()}
    </View>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function DataRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: string
  color: string
}) {
  return (
    <View style={dataRowStyles.row}>
      <Text style={dataRowStyles.icon}>{icon}</Text>
      <Text style={dataRowStyles.label}>{label}</Text>
      <Text style={[dataRowStyles.value, { color }]}>{value}</Text>
    </View>
  )
}

function StatPill({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <View style={[statPillStyles.pill, active && statPillStyles.pillActive]}>
      <Text style={[statPillStyles.value, active && statPillStyles.valueActive]}>{value}</Text>
      <Text style={statPillStyles.label}>{label}</Text>
    </View>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function permLabel(s: PermissionStatus): string {
  const map: Record<PermissionStatus, string> = {
    unknown: "Não verificada",
    requesting: "Solicitando...",
    granted: "✓ Permissão concedida",
    denied: "✗ Permissão negada",
  }
  return map[s]
}

function permColor(s: PermissionStatus): string {
  const map: Record<PermissionStatus, string> = {
    unknown: "#8E8E93",
    requesting: "#FF9500",
    granted: "#34C759",
    denied: "#FF3B30",
  }
  return map[s]
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const BLUE = "#007AFF"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },

  // Header
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 10 },
  headerStats: { flexDirection: "row", gap: 8 },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 2,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: BLUE },
  tabIcon: { fontSize: 18 },
  tabLabel: { fontSize: 11, color: "#8E8E93", fontWeight: "600" },
  tabLabelActive: { color: BLUE },

  // Tab content
  tabContent: { padding: 16, gap: 14 },

  // Section cards
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1C1C1E" },
  sectionDesc: { fontSize: 13, color: "#636366", lineHeight: 19 },
  codeInline: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    backgroundColor: "#F2F2F7",
    color: BLUE,
    fontSize: 12,
  },

  // Permission badge
  permBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  permBadgeText: { color: "white", fontSize: 13, fontWeight: "600" },

  // Buttons
  btnPrimary: {
    backgroundColor: BLUE,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  btnPrimaryText: { color: "white", fontWeight: "700", fontSize: 15 },
  btnDanger: { backgroundColor: "#FF3B30" },
  btnDisabled: { opacity: 0.5 },
  btnSecondary: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BLUE,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  btnSecondaryText: { color: BLUE, fontWeight: "700", fontSize: 15 },

  // Data grid
  dataGrid: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    overflow: "hidden",
  },

  // Address box
  addressBox: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  addressLine: { fontSize: 14, color: "#1C1C1E" },
  loadingText: { fontSize: 13, color: "#8E8E93", fontStyle: "italic" },

  // Tracking badge
  trackingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 10,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
  },
  trackingText: { fontSize: 13, color: "#1C1C1E" },

  // Globe visualizer
  globe: {
    height: 200,
    backgroundColor: "#0a1628",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginTop: 4,
  },
  globeLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: "rgba(0,122,255,0.3)",
  },
  globeLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: "rgba(0,122,255,0.3)",
  },
  globeLabel: {
    position: "absolute",
    color: "rgba(255,255,255,0.35)",
    fontSize: 9,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  globeLabelEquator: {
    position: "absolute",
    color: "rgba(255,200,0,0.5)",
    fontSize: 9,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  globeMarker: {
    position: "absolute",
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    alignItems: "center",
    justifyContent: "center",
  },
  globeMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
    borderWidth: 2,
    borderColor: "white",
  },
  globeMarkerPulse: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,122,255,0.3)",
    borderWidth: 1,
    borderColor: "rgba(0,122,255,0.5)",
  },
  globeEmpty: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  globeEmptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // Coord display
  coordDisplay: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    overflow: "hidden",
  },
  coordItem: { flex: 1, padding: 12, alignItems: "center", gap: 2 },
  coordDivider: { width: 1, backgroundColor: "#E5E5EA" },
  coordLabel: { fontSize: 10, color: "#8E8E93", fontWeight: "700", letterSpacing: 0.5 },
  coordValue: {
    fontSize: 16,
    fontWeight: "700",
    color: BLUE,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  coordHint: { fontSize: 10, color: "#8E8E93" },

  // Code block
  codeBlock: {
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 12,
    gap: 2,
  },
  codeBlockText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#98C379",
  },

  // Note card
  noteCard: { borderLeftWidth: 4, borderLeftColor: "#FF9500" },
  noteTitle: { fontSize: 15, fontWeight: "700", color: "#FF9500" },
  noteText: { fontSize: 13, color: "#636366", lineHeight: 19 },
  noteBuildSteps: {
    backgroundColor: "#FFF9F0",
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  noteStepTitle: { fontSize: 12, color: "#FF9500", fontWeight: "700", marginBottom: 2 },
  noteStep: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#1C1C1E",
  },

  // Conceitos
  conceitosIntro: {
    fontSize: 14,
    color: "#636366",
    marginBottom: 4,
    lineHeight: 20,
  },
  conceitoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  conceitoIcon: { fontSize: 28, lineHeight: 32 },
  conceitoBody: { flex: 1, gap: 4 },
  conceitoTitle: { fontSize: 14, fontWeight: "700" },
  conceitoText: { fontSize: 13, color: "#636366", lineHeight: 18 },

  // Fluxo
  fluxoCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fluxoTitle: { fontSize: 16, fontWeight: "700", color: "#1C1C1E", marginBottom: 4 },
  fluxoStep: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  fluxoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  fluxoBadgeText: { color: "white", fontSize: 13, fontWeight: "bold" },
  fluxoInfo: { flex: 1, gap: 2 },
  fluxoCode: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: BLUE,
    backgroundColor: "#F0F6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  fluxoDesc: { fontSize: 12, color: "#8E8E93" },
})

const dataRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
    gap: 8,
  },
  icon: { fontSize: 16, width: 22 },
  label: { flex: 1, fontSize: 13, color: "#636366", fontWeight: "500" },
  value: { fontSize: 14, fontWeight: "700" },
})

const statPillStyles = StyleSheet.create({
  pill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    gap: 1,
  },
  pillActive: { backgroundColor: "rgba(255,255,255,0.35)" },
  value: { fontSize: 14, fontWeight: "bold", color: "rgba(255,255,255,0.7)" },
  valueActive: { color: "white" },
  label: { fontSize: 10, color: "rgba(255,255,255,0.6)" },
})
