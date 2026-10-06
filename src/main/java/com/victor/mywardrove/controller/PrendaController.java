package com.victor.mywardrove.controller;

import com.victor.mywardrove.entity.Prenda;
import com.victor.mywardrove.service.PrendaService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/prendas")
@CrossOrigin(origins = "*")
public class PrendaController {

    private final PrendaService prendaService;

    public PrendaController(PrendaService prendaService) {
        this.prendaService = prendaService;
    }


    // ========================================
    // OBTENER TODAS LAS PRENDAS
    // ========================================

    @GetMapping
    public List<Prenda> obtenerTodas() {

        return prendaService.obtenerTodas();

    }


    // ========================================
    // CREAR PRENDA
    // ========================================

    @PostMapping
    public Prenda crear(
            @RequestBody Prenda prenda) {

        return prendaService.guardar(prenda);

    }


    // ========================================
    // EDITAR PRENDA
    // ========================================

    @PutMapping("/{id}")
    public Prenda editar(
            @PathVariable Long id,
            @RequestBody Prenda prenda) {

        prenda.setId(id);

        return prendaService.guardar(prenda);

    }


    // ========================================
    // ELIMINAR PRENDA + IMAGEN
    // ========================================

    @DeleteMapping("/{id}")
    public void eliminar(
            @PathVariable Long id) {

        try {

            // Buscar la prenda antes de eliminarla
            Prenda prenda =
                    prendaService.obtenerPorId(id);

            // Guardar el nombre de la imagen
            String nombreImagen =
                    prenda.getImagen();

            // Eliminar la prenda de MySQL
            prendaService.eliminar(id);

            // Si tiene imagen, eliminarla también
            if (nombreImagen != null
                    && !nombreImagen.isBlank()) {

                Path carpeta = Paths.get(
                        "mywardrove",
                        "uploads"
                );

                Path imagen =
                        carpeta.resolve(nombreImagen);

                if (Files.exists(imagen)) {

                    Files.delete(imagen);

                    System.out.println(
                            "Imagen eliminada: "
                                    + nombreImagen
                    );
                }
            }

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "No se pudo eliminar la prenda y su imagen",
                    e
            );
        }

    }


    // ========================================
    // SUBIR IMAGEN + ELIMINAR FONDO
    // ========================================

    @PostMapping("/imagen")
    public String subirImagen(
            @RequestParam("imagen") MultipartFile imagen) {

        try {

            System.out.println(
                    "Archivo recibido: "
                            + imagen.getOriginalFilename()
            );


            // --------------------------------
            // CARPETA DE IMÁGENES
            // --------------------------------

            Path carpeta = Paths.get(
                    "mywardrove",
                    "uploads"
            );

            Files.createDirectories(carpeta);


            // --------------------------------
            // NOMBRE ÚNICO
            // --------------------------------

            String nombreOriginal =
                    imagen.getOriginalFilename();

            String extension = ".jpg";

            if (nombreOriginal != null
                    && nombreOriginal.contains(".")) {

                extension =
                        nombreOriginal.substring(
                                nombreOriginal.lastIndexOf(".")
                        );
            }


            String nombreBase =
                    UUID.randomUUID().toString();


            // --------------------------------
            // IMAGEN ORIGINAL TEMPORAL
            // --------------------------------

            Path imagenOriginal =
                    carpeta.resolve(
                            nombreBase + extension
                    );


            Files.copy(
                    imagen.getInputStream(),
                    imagenOriginal,
                    StandardCopyOption.REPLACE_EXISTING
            );


            System.out.println(
                    "Imagen original guardada:"
            );

            System.out.println(
                    imagenOriginal.toAbsolutePath()
            );


            // --------------------------------
            // IMAGEN FINAL PNG
            // --------------------------------

            Path imagenProcesada =
                    carpeta.resolve(
                            nombreBase + ".png"
                    );


            // --------------------------------
            // PYTHON
            // --------------------------------

            String python =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\.venv-image\\Scripts\\python.exe";


            String script =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\image_processor\\procesar_imagen.py";


            // --------------------------------
            // EJECUTAR PYTHON
            // --------------------------------

            ProcessBuilder proceso =
                    new ProcessBuilder(
                            python,
                            script,
                            imagenOriginal.toAbsolutePath().toString(),
                            imagenProcesada.toAbsolutePath().toString()
                    );


            proceso.redirectErrorStream(true);


            Process procesoEjecutado =
                    proceso.start();


            // --------------------------------
            // LEER RESPUESTA DE PYTHON
            // --------------------------------

            BufferedReader lector =
                    new BufferedReader(
                            new InputStreamReader(
                                    procesoEjecutado
                                            .getInputStream()
                            )
                    );


            String linea;

            while ((linea = lector.readLine()) != null) {

                System.out.println(
                        "PYTHON: " + linea
                );

            }


            // --------------------------------
            // ESPERAR A QUE TERMINE
            // --------------------------------

            int codigo =
                    procesoEjecutado.waitFor();


            System.out.println(
                    "Código Python: "
                            + codigo
            );


            // --------------------------------
            // COMPROBAR RESULTADO
            // --------------------------------

            if (codigo != 0) {

                throw new RuntimeException(
                        "Python terminó con código: "
                                + codigo
                );

            }


            if (!Files.exists(imagenProcesada)) {

                throw new RuntimeException(
                        "Python no creó la imagen procesada"
                );

            }


            // --------------------------------
            // BORRAR ORIGINAL
            // --------------------------------

            Files.deleteIfExists(
                    imagenOriginal
            );


            System.out.println(
                    "Imagen procesada correctamente:"
            );

            System.out.println(
                    imagenProcesada.toAbsolutePath()
            );


            // --------------------------------
            // DEVOLVER NOMBRE PNG
            // --------------------------------

            return nombreBase + ".png";


        } catch (Exception e) {

            e.printStackTrace();

            return "Error al procesar la imagen";

        }

    }


    // ========================================
    // OBTENER IMAGEN
    // ========================================

    @GetMapping("/imagen/{nombre:.+}")
    public ResponseEntity<Resource> obtenerImagen(
            @PathVariable String nombre) {

        try {

            Path ruta = Paths.get(
                    "mywardrove",
                    "uploads",
                    nombre
            );


            System.out.println(
                    "Buscando imagen en:"
            );


            System.out.println(
                    ruta.toAbsolutePath()
            );


            Resource recurso =
                    new UrlResource(
                            ruta.toUri()
                    );


            if (!recurso.exists()
                    || !recurso.isReadable()) {

                throw new RuntimeException(
                        "La imagen no existe: "
                                + ruta.toAbsolutePath()
                );

            }


            String tipoContenido =
                    Files.probeContentType(ruta);


            if (tipoContenido == null) {

                tipoContenido =
                        "application/octet-stream";

            }


            System.out.println(
                    "Tipo de contenido: "
                            + tipoContenido
            );


            return ResponseEntity.ok()
                    .header(
                            "Content-Type",
                            tipoContenido
                    )
                    .body(recurso);


        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "No se pudo cargar la imagen",
                    e
            );

        }

    }


    // ========================================
    // IMÁGENES EN USO
    // ========================================

    @GetMapping("/imagenes-en-uso")
    public List<String> imagenesEnUso() {

        List<Prenda> prendas =
                prendaService.obtenerTodas();


        return prendas.stream()
                .map(Prenda::getImagen)
                .filter(imagen ->
                        imagen != null
                )
                .filter(imagen ->
                        !imagen.isBlank()
                )
                .toList();

    }


    // ========================================
    // IMÁGENES NO UTILIZADAS
    // ========================================

    @GetMapping("/imagenes-no-utilizadas")
    public List<String> imagenesNoUtilizadas() {

        try {

            // --------------------------------
            // CARPETA DE IMÁGENES
            // --------------------------------

            Path carpeta = Paths.get(
                    "mywardrove",
                    "uploads"
            );


            // --------------------------------
            // OBTENER PRENDAS DE MYSQL
            // --------------------------------

            List<Prenda> prendas =
                    prendaService.obtenerTodas();


            // --------------------------------
            // OBTENER IMÁGENES EN USO
            // --------------------------------

            List<String> imagenesEnUso =
                    prendas.stream()
                            .map(Prenda::getImagen)
                            .filter(imagen ->
                                    imagen != null
                            )
                            .filter(imagen ->
                                    !imagen.isBlank()
                            )
                            .toList();


            // --------------------------------
            // BUSCAR IMÁGENES SIN USO
            // --------------------------------

            List<String> imagenesNoUtilizadas =
                    Files.list(carpeta)
                            .filter(Files::isRegularFile)
                            .map(path ->
                                    path.getFileName()
                                            .toString()
                            )
                            .filter(nombre ->
                                    !imagenesEnUso.contains(nombre)
                            )
                            .toList();


            // --------------------------------
            // MOSTRAR RESULTADO
            // --------------------------------

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "IMÁGENES NO UTILIZADAS:"
            );

            imagenesNoUtilizadas.forEach(
                    nombre ->
                            System.out.println(
                                    " - " + nombre
                            )
            );

            System.out.println(
                    "========================================"
            );


            return imagenesNoUtilizadas;


        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "No se pudieron comprobar las imágenes",
                    e
            );

        }

    }


    // ========================================
    // LIMPIAR IMÁGENES NO UTILIZADAS
    // ========================================

    @DeleteMapping("/imagenes-no-utilizadas")
    public List<String> eliminarImagenesNoUtilizadas() {

        try {

            // --------------------------------
            // CARPETA DE IMÁGENES
            // --------------------------------

            Path carpeta = Paths.get(
                    "mywardrove",
                    "uploads"
            );


            // --------------------------------
            // OBTENER PRENDAS DE MYSQL
            // --------------------------------

            List<Prenda> prendas =
                    prendaService.obtenerTodas();


            // --------------------------------
            // OBTENER IMÁGENES EN USO
            // --------------------------------

            List<String> imagenesEnUso =
                    prendas.stream()
                            .map(Prenda::getImagen)
                            .filter(imagen ->
                                    imagen != null
                            )
                            .filter(imagen ->
                                    !imagen.isBlank()
                            )
                            .toList();


            // --------------------------------
            // BUSCAR Y ELIMINAR SOBRANTES
            // --------------------------------

            List<String> imagenesEliminadas =
                    Files.list(carpeta)
                            .filter(Files::isRegularFile)
                            .filter(path ->
                                    !imagenesEnUso.contains(
                                            path.getFileName()
                                                    .toString()
                                    )
                            )
                            .map(path -> {

                                try {

                                    String nombre =
                                            path.getFileName()
                                                    .toString();


                                    Files.delete(path);


                                    System.out.println(
                                            "Imagen eliminada: "
                                                    + nombre
                                    );


                                    return nombre;


                                } catch (Exception e) {

                                    throw new RuntimeException(
                                            "No se pudo eliminar: "
                                                    + path,
                                            e
                                    );

                                }

                            })
                            .toList();


            // --------------------------------
            // MOSTRAR RESULTADO
            // --------------------------------

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "LIMPIEZA COMPLETADA"
            );

            System.out.println(
                    "Imágenes eliminadas: "
                            + imagenesEliminadas.size()
            );


            imagenesEliminadas.forEach(
                    nombre ->
                            System.out.println(
                                    " - " + nombre
                            )
            );


            System.out.println(
                    "========================================"
            );


            return imagenesEliminadas;


        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "No se pudieron limpiar las imágenes",
                    e
            );

        }

    }

}