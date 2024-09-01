import requests
import json

BASE_URL = "http://localhost:5000/api"

def sanitize_input(input_string):
    # Implementa aquí la lógica de sanitización
    return input_string.strip()

def register_user():
    username = sanitize_input(input("Ingrese el nombre de usuario: "))
    email = sanitize_input(input("Ingrese el email: "))
    password = input("Ingrese la contraseña: ")

    data = {
        "username": username,
        "email": email,
        "password": password
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        response.raise_for_status()
        print("Usuario registrado exitosamente.")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al registrar usuario: {e}")
        if response.status_code == 400:
            print(response.json().get('message', 'Error desconocido'))
        return None

def login_user():
    email = sanitize_input(input("Ingrese el email: "))
    password = input("Ingrese la contraseña: ")

    data = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        response.raise_for_status()
        print("Inicio de sesión exitoso.")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al iniciar sesión: {e}")
        if response.status_code == 400:
            print(response.json().get('message', 'Error desconocido'))
        return None

def get_user_profile(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener el perfil: {e}")
        if response.status_code == 401:
            print("Token inválido o expirado.")
        return None

def main():
    token = None
    while True:
        print("\n1. Registrar usuario")
        print("2. Iniciar sesión")
        print("3. Consultar perfil")
        print("4. Salir")
        choice = input("Seleccione una opción: ")

        if choice == "1":
            register_user()
        elif choice == "2":
            login_data = login_user()
            if login_data:
                token = login_data.get('token')
                print(f"Token obtenido: {token}")
        elif choice == "3":
            if token:
                profile = get_user_profile(token)
                if profile:
                    print(json.dumps(profile, indent=2))
            else:
                print("Primero debe iniciar sesión para obtener un token.")
        elif choice == "4":
            break
        else:
            print("Opción inválida. Intente de nuevo.")

if __name__ == "__main__":
    main()