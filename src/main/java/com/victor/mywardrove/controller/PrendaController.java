package com.victor.mywardrove.controller;

import com.victor.mywardrove.entity.Prenda;
import com.victor.mywardrove.service.PrendaService;
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
    // CREAR UNA NUEVA PRENDA
    // =========================

    @PostMapping
    public Prenda crear(@RequestBody Prenda prenda) {

        return prendaService.guardar(prenda);
    }


    // =========================
    // ELIMINAR UNA PRENDA
    // =========================

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {

        prendaService.eliminar(id);
    }


    // =========================
    // SUBIR UNA IMAGEN
    // =========================

    @PostMapping("/imagen")
    public String subirImagen(
            @RequestParam("imagen") MultipartFile imagen) {

        try {

            // Mostrar información en la consola
            System.out.println(
                "Archivo recibido: "
                + imagen.getOriginalFilename()
            );

            System.out.println(
                "Tamaño: "
                + imagen.getSize()
                + " bytes"
            );


            // =========================
            // CARPETA DE IMÁGENES
            // =========================

            Path carpeta = Paths.get("mywardrove", "uploads");

            Files.createDirectories(carpeta);


            // =========================
            // RUTA FINAL DE LA IMAGEN
            // =========================

            Path ruta =
                carpeta.resolve(
                    imagen.getOriginalFilename()
                );


            // =========================
            // GUARDAR IMAGEN
            // =========================

            Files.copy(
                imagen.getInputStream(),
                ruta,
                StandardCopyOption.REPLACE_EXISTING
            );


            // Mostrar dónde se ha guardado
            System.out.println(
                "Imagen guardada en: "
                + ruta.toAbsolutePath()
            );


            // Devolver nombre de la imagen
            return imagen.getOriginalFilename();


        } catch (IOException e) {

            e.printStackTrace();

            return "Error al guardar la imagen";
        }
    }
}