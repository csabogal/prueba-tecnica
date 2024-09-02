# Prueba Técnica

## Introducción

El presente proyecto describe la construcción y funcionamiento de una aplicación web completa diseñada para la gestión de usuarios y productos. El frontend fue desarrollado con Respond y el backend en Node.js con Express. La aplicación incluye funcionalidades clave como la autenticación de usuarios, carga masiva de datos, integración con dos APIs externas y un script en Python que interactúa con el sistema.

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- MongoDB (v4 o superior)
- Python (v3.6 o superior)

## Instalación

### Clonar el Repositorio


```bash
git clone https://github.com/csabogal/prueba-tecnica.git
cd prueba-tecnica
```

### Configuración del Backend
1. Navega al directorio del backend:
    ```bash
    cd /prueba-tecnica/backend
    ```
verifica que tengas instalado Node.js (v14 o superior) de lo contrario ve a la página para descargarlo

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Inicia el servidor:
    ```bash
    node server.js
    ```

### Configuración del Frontend
1. Navega al directorio del frontend:
    ```bash
    cd ../prueba-tecnica
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Inicia la aplicación:
    ```bash
    npm start
    ```

## Configuración de la Base de Datos
El proyecto utiliza MongoDB como base de datos. Asegúrate de tener MongoDB instalado y en ejecución.

**La conexión a la base de datos se configura en el archivo `.env` del backend.**
```javascript
   MONGO_URI=mongodb+srv://csabogal:*****@cluster0.jrqym. mongodb.net/
```

Luego se importa la dependencia para configurarla en el server del backend

```javascript
// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado exitosamente"))
  .catch((err) => {
    console.error("Error detallado al conectar a MongoDB:", err);
    process.exit(1);
  });
```

## Integración de las API's Externas

**jsonplaceholder api:** 
- URL: https://jsonplaceholder.typicode.com/ 
- Uso: Para obtener información adicional del usuario en el perfil. 
- Endpoint utilizado: https://jsonplaceholder.typicode.com/users/{userId}
**Fake Store API:** 
- URL: https://fakestoreapi.com/ 
- Uso: Para poblar el módulo de productos con datos adicionales. 
- Endpoint utilizado: https://fakestoreapi.com/products

Estas APIs gratuitas nos han permitido enriquecer la funcionalidad de nuestra aplicación, proporcionando datos de ejemplo para el perfil de usuario y para el catálogo de productos.

```javascript
// Obtener productos de la API externa
const externalResponse = await fetch("https://fakestoreapi.com/products");
if (!externalResponse.ok) {
  throw new Error("Error al cargar los productos de la API externa");
}
const externalData = await externalResponse.json();

// Combinar y formatear los productos
const combinedProducts = [
  ...localData,
  ...externalData.map((product) => ({
    _id: `external_${product.id}`,
    name: product.title,
    description: product.description,
    category: product.category,
    quantity: Math.floor(Math.random() * 100), // Cantidad aleatoria
    price: product.price,
  })),
];
```

## Carga Masiva de Datos

Para realizar la carga masiva de datos en la base de datos, se utiliza una ruta específica en el backend que permite la inserción de múltiples productos a la vez.

```javascript
// Inserción masiva de productos
router.post("/bulk", authMiddleware, async (req, res) => {
  try {
    const products = req.body;
    const insertedProducts = await Product.insertMany(products);
    res.status(201).json(insertedProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

### Requisitos Previos

- Asegúrate de tener el servidor backend en funcionamiento.
- Asegúrate de tener un archivo Excel con los datos de los productos que deseas cargar.
**Formato del Archivo Excel** 
- El archivo Excel debe tener las siguientes columnas: 
  - **name:** Nombre del producto (obligatorio) 
  - **description:** Descripción del producto (obligatorio) 
  - **category:** Categoría del producto (obligatorio) 
  - **quantity:** Cantidad del producto (opcional, por defecto 0) 
  - **price:** Precio del producto (opcional, por defecto 0)

**Pasos para la Carga Masiva**

- Accede a la Sección de Productos:
  - Navega a la sección de productos en la aplicación web.
- Sube el Archivo Excel:
  - Busca la opción para subir un archivo Excel.
  - Selecciona el archivo Excel que contiene los datos de los productos.
- Validación y Carga:
  - El sistema validará los datos del archivo Excel.
  - Si hay errores en el archivo, se mostrarán mensajes de error específicos.
  - Si los datos son válidos, se procederá a la carga masiva de los productos en la base de datos.

## Uso del Script en Python para la Interacción con la API

El script en Python permite registrar usuarios, iniciar sesión y consultar el perfil del usuario utilizando la API del backend.

Para ejecutar el script, simplemente navega al directorio `python_scripts` y ejecuta:

```bash
python api_interaction.py
```

[![ejecuci-n-de-script.png](https://i.postimg.cc/yNz9SYX7/ejecuci-n-de-script.png)](https://postimg.cc/K1J46bHW)

## Sustentación

### Decisiones Técnicas

1. **Stack Tecnológico**: Se eligió React para el frontend por su popularidad y facilidad de uso. Para el backend, se utilizó Node.js con Express debido a su rendimiento y escalabilidad.
2. **Autenticación**: Se implementó JWT para la autenticación de usuarios, proporcionando un método seguro y escalable para manejar sesiones.
3. **Base de Datos**: MongoDB fue elegido por su flexibilidad y capacidad para manejar grandes volúmenes de datos no estructurados.
4. **Carga Masiva**: Se implementó una ruta específica para la carga masiva de productos, optimizando el proceso de inserción de datos en la base de datos.

### Decisiones de Diseño

1. **Componentización**: En el frontend, se siguió el principio de componentización, creando componentes reutilizables y modulares.
2. **Manejo de Estado**: Se utilizó el hook `useState` y `useEffect` de React para manejar el estado y los efectos secundarios en los componentes.
3. **Estilos**: Se utilizó Material-UI para los estilos, proporcionando una interfaz de usuario moderna y consistente teniendo como enfoque principal el UX y mobile-first.

Con estas decisiones, se buscó crear una aplicación robusta, escalable y fácil de mantener.

---

## Autor

- [@csabogal](https://github.com/csabogal)
