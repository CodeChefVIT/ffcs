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


export const deleteFavourite = async (email: string, id: string) => {
  const res = await fetch("/api/user/favorites", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      email,
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete timetable");
  }
};


export const renameFavourite = async (
  email: string,
  id: string,
  newName: string
): Promise<void> => {
  const res = await fetch("/api/user/favorites", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      email,
    },
    body: JSON.stringify({ id, newName }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to rename timetable");
  }
};
