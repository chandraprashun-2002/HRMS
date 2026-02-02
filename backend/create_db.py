import mysql.connector
from mysql.connector import Error

def create_database():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='prasun@123'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS hrms_db")
            cursor.close()
            connection.close()
    except Error as e:
        print(f"Error: {e}")
        print("\nPlease create the database manually using MySQL Workbench or command line:")

if __name__ == "__main__":
    create_database()
