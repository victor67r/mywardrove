package com.victor.mywardrove.controller;

import com.victor.mywardrove.entity.Prenda;
import com.victor.mywardrove.service.PrendaService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.List;

@RestController
@RequestMapping("/prendas")
@CrossOrigin(origins = "*")
public class PrendaController {

    private final PrendaService prendaService;

    public PrendaController(PrendaService prendaService) {
        this.prendaService = prendaService;
    }

    // =========================
    // OBTENER TODAS LAS PRENDAS
    // =========================

    @GetMapping
    public List<Prenda> obtenerTodas() {
        return prendaService.obtenerTodas();
    }

    // =========================
    // CREAR PRENDA
    // =========================

    @PostMapping
    public Prenda crear(@RequestBody Prenda prenda) {
        return prendaService.guardar(prenda);
    }

    // =========================
    // EDITAR PRENDA
    // =========================

    @PutMapping("/{id}")
    public Prenda editar(
            @PathVariable Long id,
            @RequestBody Prenda prenda) {

        prenda.setId(id);

        return prendaService.guardar(prenda);
    }

    // =========================
    // ELIMINAR PRENDA
    // =========================

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        prendaService.eliminar(id);
    }

    // =========================
    // SUBIR IMAGEN
    // =========================

    @PostMapping("/imagen")
    public String subirImagen(
            @RequestParam("imagen") MultipartFile imagen) {

        try {

            System.out.println(
                    "Archivo recibido: "
                            + imagen.getOriginalFilename()
            );

            System.out.println(
                    "Tamaño: "
                            + imagen.getSize()
                            + " bytes"
            );

            Path carpeta = Paths.get(
                    "mywardrove",
                    "uploads"
            );

            Files.createDirectories(carpeta);

            Path ruta = carpeta.resolve(
                    imagen.getOriginalFilename()
            );

            Files.copy(
                    imagen.getInputStream(),
                    ruta,
                    StandardCopyOption.REPLACE_EXISTING
            );

            System.out.println(
                    "Imagen guardada en: "
                            + ruta.toAbsolutePath()
            );

            return imagen.getOriginalFilename();

        } catch (IOException e) {

            e.printStackTrace();

            return "Error al guardar la imagen";
        }
    }

    // =========================
    // MOSTRAR IMAGEN
    // =========================

    @GetMapping("/imagen/{nombre}")
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
}