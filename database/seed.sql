INSERT INTO app.users 
    (id, name, email, password_hash) 
  VALUES 
    ('49585f33-5930-4712-aabe-fd2de8b81c77', 'John Doe', 'john@doe.com', 'hash'), 
    ('92887928-2501-4875-8c9e-2b7a109e306c', 'Jane Smith', 'jane@smith.com', 'hash'),
    ('18f6fda8-89da-4d06-9ee2-1d32602b71c5', 'Bob Dylan', 'bob@dylan.com', 'hash');

INSERT INTO app.tasks 
    (id, name, description, user_id)
  VALUES
    ('84ada2e8-33ba-4f91-880a-41e69dd4105f', 'Routine', '', '49585f33-5930-4712-aabe-fd2de8b81c77'),
    ('0b9311f5-c74f-4489-9b84-e5e997f3b284', 'Gardening', 'Taking care of my garden', '49585f33-5930-4712-aabe-fd2de8b81c77'),
    ('a37386f2-af11-4227-8aa5-fab93aecd21a', 'Pets', 'Take care of my dogs and cats', '49585f33-5930-4712-aabe-fd2de8b81c77'),
    ('937768f9-2635-43fc-93ad-5aede161fbaa', 'Stay up-to-date', 'Stay up-to-date with hardware, frontend framework and exercises', '49585f33-5930-4712-aabe-fd2de8b81c77'),

    ('90429c6b-6133-41c6-8edd-c5e459168c43', 'House', 'Cleaning and maintenance', '92887928-2501-4875-8c9e-2b7a109e306c'),
    ('098a813c-5c7b-4d2c-b6ee-c664505a6692', 'Car', 'Repairs, taxes and documentation', '92887928-2501-4875-8c9e-2b7a109e306c'),
    ('e52dfc47-758e-401a-bc51-81efac9e9440', 'Health', 'Do my periodic medical appointment', '92887928-2501-4875-8c9e-2b7a109e306c'),
    ('7f177d2f-0214-430b-9a1b-eb47d3c007b5', 'Groceries', '', '92887928-2501-4875-8c9e-2b7a109e306c'),

    ('09c17867-1e99-4707-97d7-a6bd3adee800', 'Work', 'Stuff from work i must remember', '18f6fda8-89da-4d06-9ee2-1d32602b71c5'),
    ('4d299d2f-fa42-4485-9867-858c3b89875b', 'Kids', 'Things kids needs', '18f6fda8-89da-4d06-9ee2-1d32602b71c5'),
    ('dc74004a-6c6a-4cc6-91f6-9a55f886f845', 'Pets', '', '18f6fda8-89da-4d06-9ee2-1d32602b71c5'),
    ('859432bb-b64e-42ab-8bc5-b060df167834', 'Bank', 'Bills to pay, Account management', '18f6fda8-89da-4d06-9ee2-1d32602b71c5');
  
INSERT INTO app.todos
    (id, name, description, task_id, user_id)
  VALUES
    ('4080b64e-d120-4bff-8d34-d0f27bd5ef94', 'Water the plants', 'water the plants 3 times a week. Less when raining', '0b9311f5-c74f-4489-9b84-e5e997f3b284', '49585f33-5930-4712-aabe-fd2de8b81c77'),
    ('8646f1d1-b4fa-4e10-97e7-2bc0565a2445', 'Remove Weed', 'Search for weed on plants and remove from active ones', '0b9311f5-c74f-4489-9b84-e5e997f3b284', '49585f33-5930-4712-aabe-fd2de8b81c77'),
    ('19160280-8e10-4674-81df-2582e01a62c5', 'Walk the dog', 'Take the dog for a walk at least 2 times a week', 'a37386f2-af11-4227-8aa5-fab93aecd21a', '49585f33-5930-4712-aabe-fd2de8b81c77'),
    ('a161e7a0-4c66-4f7e-8a2e-51b149f1293a', 'Read weekly hardware news', '', '937768f9-2635-43fc-93ad-5aede161fbaa', '49585f33-5930-4712-aabe-fd2de8b81c77'),

    ('7e79c074-3731-42be-a1da-9bda0c056c0d', 'Clean up the kitchen', '', '90429c6b-6133-41c6-8edd-c5e459168c43', '92887928-2501-4875-8c9e-2b7a109e306c'),
    ('33eab120-408e-45a6-9ef0-0761eb49a75c', 'Repair stairs', 'Remove rusted nails an place screws', '90429c6b-6133-41c6-8edd-c5e459168c43', '92887928-2501-4875-8c9e-2b7a109e306c'),
    ('889a9bf4-4d8e-4ae4-a77a-93a359e8063b', 'Buy some candy', 'Who does not love candy :D', '7f177d2f-0214-430b-9a1b-eb47d3c007b5', '92887928-2501-4875-8c9e-2b7a109e306c'),
    ('646b34e0-73e0-414c-809a-139cbcb8b467', 'Buy meat', 'meat meat meaaaaaaaaat!!!', '7f177d2f-0214-430b-9a1b-eb47d3c007b5', '92887928-2501-4875-8c9e-2b7a109e306c'),

    ('b8c51ae8-a814-4a73-b51c-a3cd30f1bc22', 'Diapers', 'buy 18 for week', '4d299d2f-fa42-4485-9867-858c3b89875b', '18f6fda8-89da-4d06-9ee2-1d32602b71c5'),
    ('139eed3f-9720-40f9-bcdd-aa7a24f0b03f', 'Pet Food', 'buy pet food every 22 days', 'dc74004a-6c6a-4cc6-91f6-9a55f886f845', '18f6fda8-89da-4d06-9ee2-1d32602b71c5'),
    ('a34ed40d-c884-42bd-bb62-a02a4060ab5e', 'Month Budge', 'make the graphs for the month buged', '09c17867-1e99-4707-97d7-a6bd3adee800', '18f6fda8-89da-4d06-9ee2-1d32602b71c5'),
    ('33604977-952d-4803-a326-56cd9873f675', 'Close Extra account', '', '859432bb-b64e-42ab-8bc5-b060df167834', '18f6fda8-89da-4d06-9ee2-1d32602b71c5');
