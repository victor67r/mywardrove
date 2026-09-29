from rembg import remove
import sys


# Comprobamos que se han recibido los argumentos necesarios

if len(sys.argv) != 3:
    print("Uso: python procesar_imagen.py entrada.jpg salida.png")
    sys.exit(1)


# Recibimos las rutas desde Spring Boot

entrada_path = sys.argv[1]
salida_path = sys.argv[2]


# Leemos la imagen

with open(entrada_path, "rb") as entrada:
    imagen = entrada.read()


# Eliminamos el fondo

resultado = remove(imagen)


# Guardamos la imagen procesada

with open(salida_path, "wb") as salida:
    salida.write(resultado)


print("Imagen procesada correctamente.")