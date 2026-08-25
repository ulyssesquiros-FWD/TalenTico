import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'pages/login.html'),
        registro: resolve(__dirname, 'pages/registro.html'),
        recuperar: resolve(__dirname, 'pages/recuperar-contrasena.html'),
        tareas: resolve(__dirname, 'pages/tareas.html'),
        entrevistas: resolve(__dirname, 'pages/entrevistas.html'),
        candidatos: resolve(__dirname, 'pages/candidatos.html'),
        vacantes: resolve(__dirname, 'pages/vacantes.html'),
        empresas: resolve(__dirname, 'pages/Empresas.html'),
        postulaciones: resolve(__dirname, 'pages/Postulaciones.html'),
      },
    },
  },
});
