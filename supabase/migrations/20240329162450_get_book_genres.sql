CREATE OR REPLACE FUNCTION get_book_genres(q_book_id INTEGER) RETURNS SETOF GENRES PARALLEL SAFE AS $$
SELECT DISTINCT ON (genres.id) genres.* FROM genres JOIN
             edition_genres ON genres.id = edition_genres.genre_id JOIN
             editions ON edition_genres.edition_id=editions.id JOIN books
                                                                    ON editions.book_id=books.id WHERE books.id=q_book_id;
$$ LANGUAGE SQL;
