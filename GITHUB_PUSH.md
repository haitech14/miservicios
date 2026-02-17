# Subir el proyecto a GitHub

El commit ya está hecho en tu repositorio local. Para guardarlo en GitHub:

## 1. Crear el repositorio en GitHub

1. Entra en [github.com/new](https://github.com/new).
2. Elige un nombre (por ejemplo `mi-servicios` o `haiservices`).
3. No marques "Add a README" (ya tienes código).
4. Clic en **Create repository**.

## 2. Conectar y subir

En la terminal, desde la carpeta del proyecto (`c:\Users\nicol\mi-servicios`):

```bash
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git branch -M main
git push -u origin main
```

Sustituye `TU_USUARIO` por tu usuario de GitHub y `NOMBRE_REPO` por el nombre del repositorio que creaste.

Si tu rama local se llama `master` y quieres mantenerla:

```bash
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git push -u origin master
```

## Nota

El archivo `backend/.env` no se sube (está en `.gitignore`). En GitHub o en otro entorno, crea `backend/.env` con:

```
DATABASE_URL="file:./dev.db"
```
