export type TipoOrganizacion = 'universidad' | 'centro' | 'empresa'

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
}
