import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Fade
} from '@mui/material'
import { Shuffle, Casino } from '@mui/icons-material'

const TorneoFutbolAvanzado = () => {
  const [personasDisponibles] = useState([
    'Anthony C.', 'Fran G.', 'Cesar', 'Yair',
    'Armandito', 'Armando', 'Carlos D.', 'Noel',
    'Enyer', 'Jose A.', 'Santiago', 'Luis D.',
    'Diego D.', 'Josep', 'Jorge B.', 'Juan L.'
  ])

  const [sorteoRealizado, setSorteoRealizado] = useState(false)
  const [sorteoEnProgreso, setSorteoEnProgreso] = useState(false)
  const [indiceActual, setIndiceActual] = useState(0)
  const [personasMezcladas, setPersonasMezcladas] = useState([])
  const [jugadorConBrillo, setJugadorConBrillo] = useState(null)

  // Estados
  const [ganadoresGrupos, setGanadoresGrupos] = useState({})
  const [ganadorSemifinal, setGanadorSemifinal] = useState({})
  const [ganadorFinal, setGanadorFinal] = useState(null)
  const [campeon, setCampeon] = useState(null) // NUEVO: Estado para el campeón

  // NUEVOS ESTADOS PARA SEMIFINAL 2 (C y D)
  const [semifinal2Jugador1, setSemifinal2Jugador1] = useState(null)
  const [semifinal2Jugador2, setSemifinal2Jugador2] = useState(null)

  // NUEVOS ESTADOS PARA SEMIFINAL 1 (A y B)
  const [semifinal1Jugador1, setSemifinal1Jugador1] = useState(null)
  const [semifinal1Jugador2, setSemifinal1Jugador2] = useState(null)

  const [enfrentamientos, setEnfrentamientos] = useState([
    {
      nombre: 'Grupo A',
      partidos: [
        { jugador1: '?', jugador2: '?' },
        { jugador1: '?', jugador2: '?' }
      ]
    },
    {
      nombre: 'Grupo B',
      partidos: [
        { jugador1: '?', jugador2: '?' },
        { jugador1: '?', jugador2: '?' }
      ]
    },
    {
      nombre: 'Grupo C',
      partidos: [
        { jugador1: '?', jugador2: '?' },
        { jugador1: '?', jugador2: '?' }
      ]
    },
    {
      nombre: 'Grupo D',
      partidos: [
        { jugador1: '?', jugador2: '?' },
        { jugador1: '?', jugador2: '?' }
      ]
    }
  ])

  const iniciarSorteo = () => {
    if (personasDisponibles.length < 16) return

    setSorteoEnProgreso(true)
    setSorteoRealizado(false)
    setIndiceActual(0)
    setJugadorConBrillo(null)
    setGanadoresGrupos({})
    setGanadorSemifinal({})
    setGanadorFinal(null)
    setCampeon(null) // NUEVO: Resetear campeón

    // Resetear estados de Semifinales
    setSemifinal2Jugador1(null)
    setSemifinal2Jugador2(null)
    setSemifinal1Jugador1(null)
    setSemifinal1Jugador2(null)

    // Resetear enfrentamientos
    setEnfrentamientos(prev => prev.map(grupo => ({
      ...grupo,
      partidos: [
        { jugador1: '?', jugador2: '?' },
        { jugador1: '?', jugador2: '?' }
      ]
    })))

    // Mezclar jugadores usando Fisher-Yates
    const mezclarArray = (array) => {
      const nuevoArray = [...array]
      for (let i = nuevoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]]
      }
      return nuevoArray
    }

    const mezcladas = mezclarArray(personasDisponibles).slice(0, 16)
    setPersonasMezcladas(mezcladas)

    // Iniciar revelación progresiva
    revelarSiguienteJugador(mezcladas, 0)
  }

  const revelarSiguienteJugador = (mezcladas, index) => {
    if (index >= 16) {
      setSorteoRealizado(true)
      setSorteoEnProgreso(false)
      setJugadorConBrillo(null)
      return
    }

    const grupoIndex = Math.floor(index / 4)
    const posicionEnGrupo = index % 4
    const partidoIndex = Math.floor(posicionEnGrupo / 2)
    const jugadorEnPartido = posicionEnGrupo % 2

    setEnfrentamientos(prev => {
      const nuevos = [...prev]
      const campo = jugadorEnPartido === 0 ? 'jugador1' : 'jugador2'
      nuevos[grupoIndex].partidos[partidoIndex][campo] = mezcladas[index]
      return nuevos
    })

    setJugadorConBrillo({ grupoIndex, partidoIndex, jugador: jugadorEnPartido })

    setTimeout(() => {
      setJugadorConBrillo(null)
      setIndiceActual(index + 1)
      revelarSiguienteJugador(mezcladas, index + 1)
    }, 3000)
  }

  // Función para seleccionar ganador en los grupos
  const seleccionarGanadorGrupo = (grupoIndex, partidoIndex, jugadorNombre) => {
    const clave = `${grupoIndex}-${partidoIndex}`
    setGanadoresGrupos(prev => ({
      ...prev,
      [clave]: jugadorNombre
    }))
  }

  // Función para seleccionar ganador en semifinal 2 (Grupos C y D)
  const seleccionarGanadorSemifinal2 = (jugadorNombre) => {
    setGanadorSemifinal(prev => ({
      ...prev,
      2: jugadorNombre
    }))
  }

  // Función para seleccionar ganador en semifinal 1 (Grupos A y B)
  const seleccionarGanadorSemifinal1 = (jugadorNombre) => {
    setGanadorSemifinal(prev => ({
      ...prev,
      1: jugadorNombre
    }))
  }

  // NUEVO: Función para seleccionar campeón desde los finalistas
  const seleccionarCampeon = (jugadorNombre) => {
    if (sorteoRealizado && jugadorNombre) {
      setCampeon(jugadorNombre)
    }
  }

  // NUEVAS FUNCIONES: Copiar desde Cuartos C a Semifinal 2
  const copiarDesdeCuartosC = (jugador) => {
    if (sorteoRealizado && jugador) {
      setSemifinal2Jugador1(jugador)
    }
  }

  // NUEVAS FUNCIONES: Copiar desde Cuartos D a Semifinal 2
  const copiarDesdeCuartosD = (jugador) => {
    if (sorteoRealizado && jugador) {
      setSemifinal2Jugador2(jugador)
    }
  }

  // NUEVAS FUNCIONES: Copiar desde Cuartos A a Semifinal 1
  const copiarDesdeCuartosA = (jugador) => {
    if (sorteoRealizado && jugador) {
      setSemifinal1Jugador1(jugador)
    }
  }

  // NUEVAS FUNCIONES: Copiar desde Cuartos B a Semifinal 1
  const copiarDesdeCuartosB = (jugador) => {
    if (sorteoRealizado && jugador) {
      setSemifinal1Jugador2(jugador)
    }
  }

  // NUEVO: Componente de Campeón
  const ColumnaCampeon = () => {
    const ganadorSemifinal1 = ganadorSemifinal[1]
    const ganadorSemifinal2 = ganadorSemifinal[2]

    return (
      <Card sx={{
        width: 180,
        boxShadow: 5,
        height: 180,
        background: 'linear-gradient(135deg, #d0231aff 0%, #ffd600 100%)',
        border: '3px solid #ff9800',
        opacity: sorteoRealizado ? 1 : 0.6,
        transition: 'all 0.3s ease',
        marginBottom: 2
      }}>
        <CardContent sx={{ p: 2, height: '100%' }}>
          <Box sx={{
            textAlign: 'center',
            mb: 0.1,
            p: 0.1,
            backgroundColor: '#33ae0dff',
            color: 'white',
            borderRadius: 1,
            border: '2px solid #f57c00'
          }}>
            <Typography variant="h6" fontWeight="bold">
              🏆 CAMPEÓN
            </Typography>
          </Box>

          <Box sx={{
            height: 'calc(100% - 70px)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper
              sx={{
                p: 1,
                backgroundColor: campeon ? '#ff9800' : '#f5f5f5',
                color: campeon ? 'white' : '#9e9e9e',
                minHeight: 50,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: campeon ? '3px solid #f57c00' : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {campeon || '?'}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Componente de la Copa
  const CopaCentro = () => (
    <Box sx={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      <Box
        component="img"
        src="/copa-mundial.png"
        alt="Copa Mundial"
        sx={{
          width: 180,
          height: 180,
          objectFit: 'contain',
          filter: sorteoEnProgreso
            ? 'drop-shadow(0px 4px 12px rgba(255,193,7,0.8))'
            : 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
          transition: 'all 0.5s ease',
        }}
      />
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mt: 2,
          background: sorteoEnProgreso
            ? 'linear-gradient(45deg, #FF6B35, #FF8E53)'
            : 'linear-gradient(45deg, #FFD700, #FFEC8B)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {sorteoEnProgreso ? '🎰 SORTEANDO...' : '🏆 COPA 2025'}
      </Typography>
      {sorteoEnProgreso && (
        <Fade in={sorteoEnProgreso}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="primary" fontWeight="bold">
              Revelando jugador {indiceActual + 1} de 16
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Progreso: {Math.floor(((indiceActual + 1) / 16) * 100)}%
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  )

  // Componente de Grupo
  const GrupoSimple = ({ grupo, index }) => {
    const tieneBrillo = (partidoIndex, jugadorIndex) => {
      return jugadorConBrillo &&
        jugadorConBrillo.grupoIndex === index &&
        jugadorConBrillo.partidoIndex === partidoIndex &&
        jugadorConBrillo.jugador === jugadorIndex
    }

    const esGanadorGrupo = (partidoIndex, jugadorNombre) => {
      const clave = `${index}-${partidoIndex}`
      return ganadoresGrupos[clave] === jugadorNombre
    }

    return (
      <Card sx={{
        maxWidth: 320,
        boxShadow: 3,
        height: 300,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '2px solid #dee2e6',
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 2, height: '100%' }}>
          <Box sx={{
            textAlign: 'center',
            mb: 2,
            p: 1,
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 1,
            border: '2px solid #0056b3'
          }}>
            <Typography variant="h6" fontWeight="bold">
              {grupo.nombre}
            </Typography>
          </Box>

          <Box sx={{ height: 'calc(100% - 60px)' }}>
            {grupo.partidos.map((partido, partidoIndex) => (
              <Box key={partidoIndex} sx={{ mb: 2 }}>
                <Box sx={{
                  height: '2px',
                  backgroundColor: '#495057',
                  position: 'relative',
                  mb: 1
                }}>
                  <Box sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '2px',
                    height: '20px',
                    backgroundColor: '#495057'
                  }} />
                  <Box sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '2px',
                    height: '20px',
                    backgroundColor: '#495057'
                  }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Paper
                    variant="outlined"
                    onClick={() => sorteoRealizado && seleccionarGanadorGrupo(index, partidoIndex, partido.jugador1)}
                    sx={{
                      p: 1,
                      textAlign: 'center',
                      backgroundColor: esGanadorGrupo(partidoIndex, partido.jugador1) ? '#4caf50' : 'white',
                      minHeight: 40,
                      minWidth: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      mr: 1,
                      border: esGanadorGrupo(partidoIndex, partido.jugador1) ? '2px solid #388e3c' : '1px solid #ced4da',
                      cursor: sorteoRealizado ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      '&:hover': sorteoRealizado ? {
                        backgroundColor: esGanadorGrupo(partidoIndex, partido.jugador1) ? '#45a049' : '#f5f5f5',
                        transform: 'scale(1.05)'
                      } : {},
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{
                        fontSize: '1.1rem',
                        color: esGanadorGrupo(partidoIndex, partido.jugador1) ? 'white' :
                          (partido.jugador1 === '?' ? '#6c757d' : '#1976d2'),
                        animation: tieneBrillo(partidoIndex, 0) ? 'brillo 2s ease-in-out' : 'none',
                        '@keyframes brillo': {
                          '0%': {
                            textShadow: '0 0 5px #ffea00ff, 0 0 10px #FFD700',
                            transform: 'scale(1)',
                            fontSize: '0.875rem'
                          },
                          '50%': {
                            textShadow: '0 0 20px #FFD700, 0 0 30px #FFD700',
                            transform: 'scale(1.8)',
                            fontSize: '1.25rem'
                          },
                          '100%': {
                            textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700',
                            transform: 'scale(1.3)',
                            fontSize: '1rem'
                          }
                        }
                      }}
                    >
                      {partido.jugador1}
                    </Typography>
                  </Paper>

                  <Box sx={{ textAlign: 'center', minWidth: 30 }}>
                    <Typography variant="caption" fontWeight="bold" color="red">
                      VS
                    </Typography>
                  </Box>

                  <Paper
                    variant="outlined"
                    onClick={() => sorteoRealizado && seleccionarGanadorGrupo(index, partidoIndex, partido.jugador2)}
                    sx={{
                      p: 1,
                      textAlign: 'center',
                      backgroundColor: esGanadorGrupo(partidoIndex, partido.jugador2) ? '#4caf50' : 'white',
                      minHeight: 40,
                      minWidth: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      ml: 1,
                      border: esGanadorGrupo(partidoIndex, partido.jugador2) ? '2px solid #388e3c' : '1px solid #ced4da',
                      cursor: sorteoRealizado ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      '&:hover': sorteoRealizado ? {
                        backgroundColor: esGanadorGrupo(partidoIndex, partido.jugador2) ? '#45a049' : '#f5f5f5',
                        transform: 'scale(1.05)'
                      } : {}
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{
                        fontSize: '1.1rem',
                        color: esGanadorGrupo(partidoIndex, partido.jugador2) ? 'white' :
                          (partido.jugador2 === '?' ? '#6c757d' : '#1976d2'),
                        animation: tieneBrillo(partidoIndex, 1) ? 'brillo 2s ease-in-out' : 'none'
                      }}
                    >
                      {partido.jugador2}
                    </Typography>
                  </Paper>
                </Box>

                {partidoIndex === 0 && (
                  <Box sx={{
                    height: '20px',
                    width: '2px',
                    backgroundColor: '#495057',
                    margin: '0 auto',
                    mt: 1
                  }} />
                )}
              </Box>
            ))}

            <Box sx={{
              position: 'relative',
              height: '30px',
              width: '2px',
              backgroundColor: '#495057',
              margin: '0 auto',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '-40%',
                width: '80%',
                height: '2px',
                backgroundColor: '#495057'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                right: '-40%',
                width: '80%',
                height: '2px',
                backgroundColor: '#495057'
              }
            }} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  // MODIFICADO: Columna de Cuartos de Final - AHORA ES INTERACTIVA PARA TODOS LOS GRUPOS
  const ColumnaCuartosFinal = ({ grupoIndex, titulo, grupo }) => {
    const grupoEnfrentamientos = enfrentamientos[grupoIndex]
    const ganadorPartido1 = ganadoresGrupos[`${grupoIndex}-0`]
    const ganadorPartido2 = ganadoresGrupos[`${grupoIndex}-1`]

    // Función para manejar clic en celda de Cuartos
    const handleClick = (jugador) => {
      if (!sorteoRealizado || !jugador) return

      if (grupo === 'C') {
        copiarDesdeCuartosC(jugador)
      } else if (grupo === 'D') {
        copiarDesdeCuartosD(jugador)
      } else if (grupo === 'A') {
        copiarDesdeCuartosA(jugador)
      } else if (grupo === 'B') {
        copiarDesdeCuartosB(jugador)
      }
    }

    return (
      <Card sx={{
        width: 140,
        boxShadow: 3,
        height: 260,
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        border: '2px solid #4caf50',
        opacity: sorteoRealizado ? 1 : 0.6,
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 1.5, height: '100%' }}>
          <Box sx={{
            textAlign: 'center',
            mb: 2,
            p: 1,
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: 1
          }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {titulo || `CUARTOS ${grupoEnfrentamientos.nombre.split(' ')[1]}`}
            </Typography>
          </Box>

          <Box sx={{ height: 'calc(100% - 70px)' }}>
            {/* Primera celda: Ganador del primer partido del grupo */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Paper
                onClick={() => handleClick(ganadorPartido1)}
                sx={{
                  p: 1,
                  backgroundColor: ganadorPartido1 ? '#4caf50' : '#f5f5f5',
                  color: ganadorPartido1 ? 'white' : '#9e9e9e',
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: ganadorPartido1 ? '1px solid #388e3c' : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  cursor: sorteoRealizado && ganadorPartido1 ? 'pointer' : 'default',
                  '&:hover': sorteoRealizado && ganadorPartido1 ? {
                    backgroundColor: '#45a049',
                    transform: 'scale(1.02)'
                  } : {}
                }}
              >
                <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">
                  {ganadorPartido1 || 'Por elegir'}
                </Typography>
              </Paper>
            </Box>

            {/* Segunda celda: Ganador del segundo partido del grupo */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Paper
                onClick={() => handleClick(ganadorPartido2)}
                sx={{
                  p: 1,
                  backgroundColor: ganadorPartido2 ? '#4caf50' : '#f5f5f5',
                  color: ganadorPartido2 ? 'white' : '#9e9e9e',
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: ganadorPartido2 ? '1px solid #388e3c' : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  cursor: sorteoRealizado && ganadorPartido2 ? 'pointer' : 'default',
                  '&:hover': sorteoRealizado && ganadorPartido2 ? {
                    backgroundColor: '#45a049',
                    transform: 'scale(1.02)'
                  } : {}
                }}
              >
                <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">
                  {ganadorPartido2 || 'Por elegir'}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // MODIFICADO: Columna de Semifinal 2 - AHORA TIENE DOS CELDAS INDEPENDIENTES
  const ColumnaSemifinal2 = ({ titulo }) => {
    const ganadorSemifinal2 = ganadorSemifinal[2]

    return (
      <Card sx={{
        width: 140,
        boxShadow: 3,
        height: 260,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        border: '2px solid #2196f3',
        opacity: sorteoRealizado ? 1 : 0.6,
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 1.5, height: '100%' }}>
          <Box sx={{
            textAlign: 'center',
            mb: 2,
            p: 1,
            backgroundColor: '#2196f3',
            color: 'white',
            borderRadius: 1
          }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {titulo || 'SEMIFINAL 2'}
            </Typography>
          </Box>

          <Box sx={{ height: 'calc(100% - 70px)', textAlign: 'center' }}>
            {/* Primera celda: Jugador de Cuartos C */}
            <Paper
              onClick={() => {
                if (sorteoRealizado && semifinal2Jugador1) {
                  seleccionarGanadorSemifinal2(semifinal2Jugador1)
                }
              }}
              sx={{
                p: 1,
                backgroundColor: semifinal2Jugador1 ?
                  (ganadorSemifinal2 === semifinal2Jugador1 ? '#2196f3' : '#f5f5f5') : '#f5f5f5',
                color: semifinal2Jugador1 ?
                  (ganadorSemifinal2 === semifinal2Jugador1 ? 'white' : '#1976d2') : '#9e9e9e',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: semifinal2Jugador1 ?
                  (ganadorSemifinal2 === semifinal2Jugador1 ? '2px solid #1976d2' : '1px solid #1976d2') : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: sorteoRealizado && semifinal2Jugador1 ? 'pointer' : 'default',
                '&:hover': sorteoRealizado && semifinal2Jugador1 ? {
                  backgroundColor: ganadorSemifinal2 === semifinal2Jugador1 ? '#1976d2' : '#e3f2fd',
                  transform: 'scale(1.02)'
                } : {},
                mb: 1
              }}
            >
              <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">
                {semifinal2Jugador1 || 'Por elegir'}
              </Typography>
            </Paper>

            {/* Segunda celda: Jugador de Cuartos D */}
            <Paper
              onClick={() => {
                if (sorteoRealizado && semifinal2Jugador2) {
                  seleccionarGanadorSemifinal2(semifinal2Jugador2)
                }
              }}
              sx={{
                p: 1,
                backgroundColor: semifinal2Jugador2 ?
                  (ganadorSemifinal2 === semifinal2Jugador2 ? '#2196f3' : '#f5f5f5') : '#f5f5f5',
                color: semifinal2Jugador2 ?
                  (ganadorSemifinal2 === semifinal2Jugador2 ? 'white' : '#1976d2') : '#9e9e9e',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: semifinal2Jugador2 ?
                  (ganadorSemifinal2 === semifinal2Jugador2 ? '2px solid #1976d2' : '1px solid #1976d2') : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: sorteoRealizado && semifinal2Jugador2 ? 'pointer' : 'default',
                '&:hover': sorteoRealizado && semifinal2Jugador2 ? {
                  backgroundColor: ganadorSemifinal2 === semifinal2Jugador2 ? '#1976d2' : '#e3f2fd',
                  transform: 'scale(1.02)'
                } : {}
              }}
            >
              <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">
                {semifinal2Jugador2 || 'Por elegir'}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // MODIFICADO: Columna de Semifinal 1 - AHORA TIENE DOS CELDAS INDEPENDIENTES
  const ColumnaSemifinal1 = ({ titulo }) => {
    const ganadorSemifinal1 = ganadorSemifinal[1]

    return (
      <Card sx={{
        width: 140,
        boxShadow: 3,
        height: 260,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        border: '2px solid #2196f3',
        opacity: sorteoRealizado ? 1 : 0.6,
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 1.5, height: '100%' }}>
          <Box sx={{
            textAlign: 'center',
            mb: 2,
            p: 1,
            backgroundColor: '#2196f3',
            color: 'white',
            borderRadius: 1
          }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {titulo || 'SEMIFINAL 1'}
            </Typography>
          </Box>

          <Box sx={{ height: 'calc(100% - 70px)', textAlign: 'center' }}>
            {/* Primera celda: Jugador de Cuartos A */}
            <Paper
              onClick={() => {
                if (sorteoRealizado && semifinal1Jugador1) {
                  seleccionarGanadorSemifinal1(semifinal1Jugador1)
                }
              }}
              sx={{
                p: 1,
                backgroundColor: semifinal1Jugador1 ?
                  (ganadorSemifinal1 === semifinal1Jugador1 ? '#2196f3' : '#f5f5f5') : '#f5f5f5',
                color: semifinal1Jugador1 ?
                  (ganadorSemifinal1 === semifinal1Jugador1 ? 'white' : '#1976d2') : '#9e9e9e',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: semifinal1Jugador1 ?
                  (ganadorSemifinal1 === semifinal1Jugador1 ? '2px solid #1976d2' : '1px solid #1976d2') : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: sorteoRealizado && semifinal1Jugador1 ? 'pointer' : 'default',
                '&:hover': sorteoRealizado && semifinal1Jugador1 ? {
                  backgroundColor: ganadorSemifinal1 === semifinal1Jugador1 ? '#1976d2' : '#e3f2fd',
                  transform: 'scale(1.02)'
                } : {},
                mb: 1
              }}
            >
              <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">
                {semifinal1Jugador1 || 'Por elegir'}
              </Typography>
            </Paper>

            {/* Segunda celda: Jugador de Cuartos B */}
            <Paper
              onClick={() => {
                if (sorteoRealizado && semifinal1Jugador2) {
                  seleccionarGanadorSemifinal1(semifinal1Jugador2)
                }
              }}
              sx={{
                p: 1,
                backgroundColor: semifinal1Jugador2 ?
                  (ganadorSemifinal1 === semifinal1Jugador2 ? '#2196f3' : '#f5f5f5') : '#f5f5f5',
                color: semifinal1Jugador2 ?
                  (ganadorSemifinal1 === semifinal1Jugador2 ? 'white' : '#1976d2') : '#9e9e9e',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: semifinal1Jugador2 ?
                  (ganadorSemifinal1 === semifinal1Jugador2 ? '2px solid #1976d2' : '1px solid #1976d2') : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: sorteoRealizado && semifinal1Jugador2 ? 'pointer' : 'default',
                '&:hover': sorteoRealizado && semifinal1Jugador2 ? {
                  backgroundColor: ganadorSemifinal1 === semifinal1Jugador2 ? '#1976d2' : '#e3f2fd',
                  transform: 'scale(1.02)'
                } : {}
              }}
            >
              <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">
                {semifinal1Jugador2 || 'Por elegir'}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // MODIFICADO: Componente de Final - AHORA ES CLICKABLE PARA SELECCIONAR CAMPEÓN
  const ColumnaFinal = ({ titulo = "FINAL", esFinalista1 = false }) => {
    const ganadorSemifinal1 = ganadorSemifinal[1]
    const ganadorSemifinal2 = ganadorSemifinal[2]

    // Determinar qué jugador mostrar basado en si es Finalista 1 o Finalista 2
    const jugadorFinalista = esFinalista1 ? ganadorSemifinal2 : ganadorSemifinal1

    return (
      <Card sx={{
        width: 140,
        boxShadow: 3,
        height: 260,
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
        border: '2px solid #ff9800',
        opacity: sorteoRealizado ? 1 : 0.6,
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 1.5, height: '100%' }}>
          <Box sx={{
            textAlign: 'center',
            mb: 2,
            p: 1,
            backgroundColor: '#ff9800',
            color: 'white',
            borderRadius: 1
          }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {titulo}
            </Typography>
          </Box>

          <Box sx={{
            height: 'calc(100% - 70px)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper
              onClick={() => sorteoRealizado && jugadorFinalista && seleccionarCampeon(jugadorFinalista)}
              sx={{
                p: 2,
                backgroundColor: jugadorFinalista ? '#ff9800' : '#f5f5f5',
                color: jugadorFinalista ? 'white' : '#9e9e9e',
                minHeight: 60,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: jugadorFinalista ? '2px solid #f57c00' : '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                cursor: sorteoRealizado && jugadorFinalista ? 'pointer' : 'default',
                '&:hover': sorteoRealizado && jugadorFinalista ? {
                  backgroundColor: '#f57c00',
                  transform: 'scale(1.05)'
                } : {}
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                {jugadorFinalista || 'Por elegir'}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{
      backgroundColor: 'grey.100',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Paper sx={{
        p: 2,
        mb: 4,
        textAlign: 'center',
        background: sorteoEnProgreso
          ? 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)'
          : 'linear-gradient(135deg, #1976d2 0%, #004ba0 100%)',
        color: 'white',
        borderRadius: 2,
        transition: 'all 0.5s ease'
      }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {sorteoEnProgreso ? '🎰 SORTEO EN CURSO' : '⚽ Copa Mundial 2025'}
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={sorteoEnProgreso ? <Casino /> : <Shuffle />}
          onClick={iniciarSorteo}
          disabled={personasDisponibles.length < 16 || sorteoEnProgreso}
          sx={{
            backgroundColor: sorteoEnProgreso ? '#ff6b35' : 'white',
            color: sorteoEnProgreso ? 'white' : '#1976d2',
            '&:hover': {
              backgroundColor: sorteoEnProgreso ? '#e55a2b' : '#f5f5f5'
            },
            fontSize: '0.80rem',
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          {sorteoEnProgreso ? `REVELANDO JUGADOR ${indiceActual + 1}/16` : 'REALIZAR SORTEO'}
        </Button>

        {sorteoEnProgreso && (
          <Fade in={sorteoEnProgreso}>
            <Box sx={{ mt: 2 }}>
              <Box sx={{
                width: '100%',
                height: 6,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    height: '100%',
                    backgroundColor: '#ffffff',
                    transition: 'width 0.5s ease',
                    width: `${((indiceActual + 1) / 16) * 100}%`,
                    borderRadius: 3
                  }}
                />
              </Box>
            </Box>
          </Fade>
        )}

        {sorteoRealizado && Object.keys(ganadoresGrupos).length > 0 && (
          <Fade in={sorteoRealizado && Object.keys(ganadoresGrupos).length > 0}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                ✅ {Object.keys(ganadoresGrupos).length}/8 enfrentamientos decididos
              </Typography>
            </Box>
          </Fade>
        )}
      </Paper>

      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        px: { xs: 2, md: 4 }
      }}>
        <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
          {/* Columna izquierda: Grupos C y D */}
          <Grid item xs={12} md={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'flex-end'
          }}>
            <GrupoSimple grupo={enfrentamientos[2]} index={2} />
            <GrupoSimple grupo={enfrentamientos[3]} index={3} />
          </Grid>

          {/* Columna central izquierda: Cuartos de final de C y D */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3
          }}>
            <ColumnaCuartosFinal grupoIndex={2} titulo="CUARTOS C" grupo="C" />
            <ColumnaCuartosFinal grupoIndex={3} titulo="CUARTOS D" grupo="D" />
          </Grid>

          {/* Columna semifinales izquierda */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3
          }}>
            <ColumnaSemifinal2 titulo="SEMIFINAL 2" />
          </Grid>

          {/* Columna Finalista 1 */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3
          }}>
            <ColumnaFinal titulo="FINALISTA 1" esFinalista1={true} />
          </Grid>

          {/* Columna central: Campeón y Copa */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ColumnaCampeon /> {/* NUEVO: Cuadro de Campeón */}
            <Box sx={{ mt: 4 }}>
              <CopaCentro />
            </Box>
          </Grid>

          {/* Columna Finalista 2 */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3
          }}>
            <ColumnaFinal titulo="FINALISTA 2" esFinalista1={false} />
          </Grid>

          {/* Columna semifinales derecha */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3
          }}>
            <ColumnaSemifinal1 titulo="SEMIFINAL 1" />
          </Grid>

          {/* Columna central derecha: Cuartos de final de A y B */}
          <Grid item xs={12} md={2} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3
          }}>
            <ColumnaCuartosFinal grupoIndex={0} titulo="CUARTOS A" grupo="A" />
            <ColumnaCuartosFinal grupoIndex={1} titulo="CUARTOS B" grupo="B" />
          </Grid>

          {/* Columna derecha: Grupos A y B */}
          <Grid item xs={12} md={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'flex-start'
          }}>
            <GrupoSimple grupo={enfrentamientos[0]} index={0} />
            <GrupoSimple grupo={enfrentamientos[1]} index={1} />
          </Grid>
        </Grid>
      </Box>

      {/* Footer que siempre está presente */}
      <Fade in={true}>
        <Paper sx={{
          p: 3,
          mt: 4,
          textAlign: 'center',
          backgroundColor: sorteoRealizado ? '#4caf50' :
            (sorteoEnProgreso ? '#ff9800' : '#1976d2'),
          color: 'white',
          borderRadius: 2,
          transition: 'all 0.5s ease'
        }}>
          {sorteoRealizado ? (
            <>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                🎉 ¡SORTEO COMPLETADO!
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                ¡Que comiencen los partidos! ⚽
              </Typography>
            </>
          ) : sorteoEnProgreso ? (
            <>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ⏳
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Revelando jugadores... Por favor espera
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ⚽ TORNEO DE FÚTBOL
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Esperando para realizar el sorteo
              </Typography>
            </>
          )}
        </Paper>
      </Fade>
    </Box>
  )
}

export default TorneoFutbolAvanzado