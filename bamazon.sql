DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL,
    stock_quantity INT   
)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Amethyst Polyhedral Dice", "Dice", 7.00, 9),
("Fire touched Polyhedral Dice", "Dice", 6.00, 5),
("The Mighty Tarrasque Miniature", "Miniatures", 50.00, 3),
("The Mushroom Forest Flippable Map Tiles", "Maps", 12.00, 4),
("Tales from the Yawning Portal", "Books", 30.00, 6),
("Explorers Guide to Wildemount", "Books", 30.00, 15),
("The Adventurer's Campsite", "Miniatures", 35.00, 2),
("The Sword Coase Adventurer's Guide", "Books", 25.00, 3),
("Ancient Red Dragon Miniature", "Miniatures", 95.00, 1),
("Purple-heart Polyhedral Dice", "Dice", 9.00, 7);