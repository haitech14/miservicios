export type TipoOrganizacion = 'universidad' | 'centro' | 'empresa' | 'gimnasio' | 'clinica' | 'comunidad' | 'facility'

export const TERMINOLOGIA: Record<
  TipoOrganizacion,
  {
    beneficiario: string
    facultad: string
    carrera: string
    credencial: string
    codigo: string
  }
> = {
  universidad: {
    beneficiario: 'Estudiante',
    facultad: 'Facultad',
    carrera: 'Carrera',
    credencial: 'Carné Universitario',
    codigo: 'Código',
  },
  centro: {
    beneficiario: 'Alumno',
    facultad: 'Área',
    carrera: 'Programa',
    credencial: 'Credencial',
    codigo: 'Código',
  },
  empresa: {
    beneficiario: 'Trabajador',
    facultad: 'Área',
    carrera: 'Cargo',
    credencial: 'ID Corporativo',
    codigo: 'Código de empleado',
  },
  gimnasio: {
    beneficiario: 'Socio',
    facultad: 'Área',
    carrera: 'Plan',
    credencial: 'Credencial',
    codigo: 'Código de socio',
  },
  clinica: {
    beneficiario: 'Paciente',
    facultad: 'Área',
    carrera: 'Especialidad',
    credencial: 'Carné de salud',
    codigo: 'Código de paciente',
  },
  comunidad: {
    beneficiario: 'Socio',
    facultad: 'Área',
    carrera: 'Rol',
    credencial: 'Credencial',
    codigo: 'Código de socio',
  },
  facility: {
    beneficiario: 'Residente',
    facultad: 'Zona',
    carrera: 'Contrato',
    credencial: 'Credencial de acceso',
    codigo: 'Código',
  },
}
