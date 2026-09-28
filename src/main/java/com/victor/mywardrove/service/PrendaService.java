package com.victor.mywardrove.service;

import com.victor.mywardrove.entity.Prenda;
import com.victor.mywardrove.repository.PrendaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrendaService {

    private final PrendaRepository prendaRepository;

    public PrendaService(PrendaRepository prendaRepository) {
        this.prendaRepository = prendaRepository;
    }

    public List<Prenda> obtenerTodas() {
        return prendaRepository.findAll();
    }

    public Prenda guardar(Prenda prenda) {
        return prendaRepository.save(prenda);
    }

    public void eliminar(Long id) {
        prendaRepository.deleteById(id);
    }
}