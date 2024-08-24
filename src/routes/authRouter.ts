import express from "express";
import { db } from "../db/client";
import { hash } from "bcrypt";
export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const {
    fName,
    lName,
    email,
    phone,
    password,
    citizenship: { number, image },
    address: { country, city, address, sketchImg },
  }: any = req.body;
  try {
    const hashedPassword = await hash(password, 10);
    const user = await db.user.create({
      data: {
        fName,
        lName,
        email,
        phone,
        password: hashedPassword,
      },
    });
    const transaction = await db.$transaction([
      db.balance.create({
        data: {
          amount: 0,
          userId: user?.id,
        },
      }),
      db.address.create({
        data: {
          city,
          country,
          address,
          sketchImg,
          userId: user?.id,
        },
      }),
      db.citizenShip.create({
        data: {
          number,
          image,
          userId: user?.id,
        },
      }),
    ]);
  } catch (error) {
    return res.json({ msg: "Error creating Account" });
  }
  res.json({
    msg: `Form Submited Succesfully,we will notify you on ${email}`,
  });
});


