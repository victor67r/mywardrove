package com.victor.mywardrove;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class PythonTest {

    public static void main(String[] args) {

        try {

            System.out.println("1. Iniciando prueba...");

            String python =
                    "C:\\Users\\victo\\Desktop\\DAM\\PROYECTOS\\App-Wardrove\\mywardrove\\.venv-image\\Scripts\\python.exe";

            String script =
                    "image_processor\\procesar_imagen.py";

            String entrada =
                    "image_processor\\imagen_prueba.jpg";

            String salida =
                    "image_processor\\prueba_java.png";


            System.out.println("2. Ejecutando Python...");


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


            String linea;

            while ((linea = lector.readLine()) != null) {

                System.out.println(
                        "PYTHON: " + linea
                );

            }


            int codigo =
                    procesoEjecutado.waitFor();


            System.out.println(
                    "3. Python terminó"
            );

            System.out.println(
                    "Código de salida: " + codigo
            );


        } catch (Exception e) {

            System.out.println(
                    "ERROR:"
            );

            e.printStackTrace();

        }

    }
}