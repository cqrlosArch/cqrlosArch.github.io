const KEY_OMDB = "fde68335";
const url = `http://www.omdbapi.com/?apikey=${KEY_OMDB}&`;

const pages = ["1", "2"]; //Para obtener 20 resultados 

//Obtiene 20 resultados por nombre de película
export async function getMovies(nameMovie) {
  let resMovies=[]
  for (const i of pages) {
    try {
      const dataFetch = await fetch(
        `${url}s=${nameMovie}&plot=full&page=${pages[i]}`
      );
      const movies = await dataFetch.json();
      resMovies= [...movies.Search,...resMovies];
    } catch (error) {
      console.log(error);
    }
  }

  return resMovies
}

//Obtiene los detalles de la película por su ID 
export async function getMovie(idMovie) {
  try {
    const dataFetch = await fetch(`${url}i=${idMovie}&plot=full`);
    const movie = await dataFetch.json();
    return movie;
  } catch (error) {
    console.log(error);
  }
}

