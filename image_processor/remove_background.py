from rembg import remove

input_path = "image_processor/imagen_prueba.jpg"
output_path = "image_processor/imagen_recortada.png"

with open(input_path, "rb") as entrada:
    imagen = entrada.read()

resultado = remove(imagen)

with open(output_path, "wb") as salida:
    salida.write(resultado)

print("Fondo eliminado correctamente.")
