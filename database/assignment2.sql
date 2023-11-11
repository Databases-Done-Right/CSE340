-- Data for table 'account' user 'Tony Stark'
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Change account belonging to Tony Stark to be an 'admin';
UPDATE public.account SET account_type = 'Admin' WHERE account_email = 'tony@starkent.com';

-- Delete account belonging to Tony Stark
DELETE FROM public.account WHERE account_email = 'tony@starkent.com';

-- Update Hummer description changing small interior to huge interior
UPDATE inventory SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') WHERE inv_id = 10;

-- Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.
SELECT i.inv_make, i.inv_model, c.classification_name FROM inventory i INNER JOIN classification c ON i.classification_id = c.classification_id WHERE c.classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.
UPDATE inventory SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


