package com.victor.mywardrove.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
public class PythonController {

    @GetMapping("/python-test")
    public String probarPython() {

        try {

            String python =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\.venv-image\\Scripts\\python.exe";

            String script =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\image_processor\\procesar_imagen.py";

            String entrada =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\image_processor\\imagen_prueba.jpg";

            String salida =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\image_processor\\prueba_spring.png";


            ProcessBuilder proceso =
                    new ProcessBuilder(
                            python,
                            script,
                            entrada,
                            salida
                    );

            proceso.redirectErrorStream(true);

            Process procesoEjecutado =
                    proceso.start();


            BufferedReader lector =
                    new BufferedReader(
                            new InputStreamReader(
                                    procesoEjecutado.getInputStream()
                            )
                    );


            StringBuilder resultado =
                    new StringBuilder();

            String linea;

            while ((linea = lector.readLine()) != null) {

                resultado.append(linea)
                         .append("\n");
            }


            int codigo =
                    procesoEjecutado.waitFor();


            return "Código: "
                    + codigo
                    + "\n"
                    + resultado;


        } catch (Exception e) {

            e.printStackTrace();

            return "Error: "
                    + e.getMessage();
        }
    }
}