/*
 mysql> select email, username, user_id from password;
 +------------------+------------------+---------+
 | email            | username         | user_id |
 +------------------+------------------+---------+
 | ann@dot.com      | ann.abbot        | 1       |
 | bob@dot.com      | bob.boebert      | 2       |
 | carol@dot.com    | carol.cruz       | 3       |
 | dan@dot.com      | dan.dinkle       | 4       |
 | erin@dot.com     | erin.emmerlin    | 5       |
 | federico@dot.com | federico.fuentes | 6       |
 +------------------+------------------+---------+
 password is the first name in lowercase
 */

insert into password (email, hash, username, user_id) values ("ann@dot.com","$2b$10$fdT4FxN8QJHuNlAcHyu.N.O09mfvC06vUUZhWpPjODIsgZil2h90q", "ann.abbot", "1");
insert into password (email, hash, username, user_id) values ("bob@dot.com","$2b$10$M6PC6KlRnPQ28ZA6db5GIe0NmqqM3u5DurrARPEB9AHPXR5oYc7nq", "bob.boebert", "2");
insert into password (email, hash, username, user_id) values ("carol@dot.com","$2b$10$ZCgTwSc8jaSL.XYSExvYp.lHfC1K9Z/4yKNl.DVjwfR/I1K61P2P2", "carol.cruz", "3");
insert into password (email, hash, username, user_id) values ("dan@dot.com","$2b$10$UFza9xeh0XGUpnw9dKpxTOxfIoZOXLwg87nC964.LajEajl9FbEN6", "dan.dinkle", "4");
insert into password (email, hash, username, user_id) values ("erin@dot.com","$2b$10$qPl5O0XNQD3/T2f.QNzRhOe7EVt7CaZdE42GmSLJ467cp33KaVuvC", "erin.emmerlin", "5");
insert into password (email, hash, username, user_id) values ("federico@dot.com","$2b$10$oUJMuxssRL87FyTduTBOdORWzOa.iHoycJCkMZaXPixx.3Vk85Mc2", "federico.fuentes", "6");
