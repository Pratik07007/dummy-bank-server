import express from "express";
import { db } from "./db/client";
const PORT = process.env.PORT || 3007;
const app = express();
app.use(express.json());

interface userRegistration {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  citizenship: { number: string; image: string };
  address: {
    country: string;
    city: string;
    address: string;
    sketchImg: string;
  };
}
app.post("/register", async (req, res) => {
  const {
    fName,
    lName,
    email,
    phone,
    citizenship: { number, image },
    address: { country, city, address, sketchImg },
  }: userRegistration = req.body;
  try {
    await db.$transaction([
      db.user.create({
        data: {
          fName,
          lName,
          email,
          phone,
        },
      }),

      db.balance.create({
        data: {
          amount: 0,
          userId: 23,
        },
      }),
      db.address.create({
        data: {
          city,
          country,
          address,
          sketchImg,
          userId: 23,
        },
      }),
      db.citizenShip.create({
        data: {
          number,
          image,
          userId: 23,
        },
      }),
    ]);
    res.json({ msg: "Please wait for verification" });
  } catch (error) {
    res.json({ error });
  }
});

app.listen(PORT, () => console.log(`Bank Server Running on port:${PORT}`));
