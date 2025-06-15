interface FavouriteTimetable {
  name: string;
  id: string;
}

export const getFavourites = async (
  userEmail: string
): Promise<FavouriteTimetable[]> => {
  try {
    const res = await fetch("/api/user/favorites", {
      headers: {
        email: userEmail,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch favourites");
    }

    const data = await res.json();
    return data.favourites.map((fav: any) => ({
      name: fav.name,
      id: fav._id,
    }));
  } catch (err) {
    console.error("getFavourites error:", err);
    return [];
  }
};