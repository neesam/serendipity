import { Request, Response } from "express";

const getUserMusicTables = async (req: Request, res: Response) => {
  const { data, error } = await req
    .db!.from("user_genres")
    .select("genre_id, genres(id, name, parent_id)");

  if (error) {
    return res.status(500).json({
      message: "Fetch failed for user genres",
      error: error.message,
    });
  }

  // Flatten to a plain list of genres
  const genres = (data ?? []).map((row: any) => row.genres);

  // Empty is valid for a user who hasn't picked any yet
  return res.status(200).json({
    message: "Fetched successfully for user genres",
    data: genres,
  });
};

export { getUserMusicTables };