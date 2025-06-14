export async function fetchUserFavourites(email: string) {
  const res = await fetch("api/user/favorites", {
    method: "GET",
    headers: {
      "email": email,
      "Content-Type" : "application/json"
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch favourites");
  }

  return res.json();
}