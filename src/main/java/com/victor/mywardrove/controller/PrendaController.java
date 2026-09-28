package com.victor.mywardrove.controller;

import com.victor.mywardrove.entity.Prenda;
import com.victor.mywardrove.service.PrendaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prendas")
@CrossOrigin(origins = "*")
public class PrendaController {

    private final PrendaService prendaService;

    public PrendaController(PrendaService prendaService) {
        this.prendaService = prendaService;
    }

    @GetMapping
    public List<Prenda> obtenerTodas() {
        return prendaService.obtenerTodas();
    }

    @PostMapping
    public Prenda crear(@RequestBody Prenda prenda) {
        return prendaService.guardar(prenda);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        prendaService.eliminar(id);
    }
}