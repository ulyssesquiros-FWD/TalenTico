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
      },
    },
  },
});
