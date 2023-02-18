import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const apiRouter : express.Router = express.Router();

apiRouter.get("/postimerkit", async (req : express.Request, res : express.Response)=>{

    if (typeof req.query.hakusana === "string") {

    let hakusana : string = `${String(req.query.hakusana)}`;

    let kohde : string = String(req.query.kohde);

    let postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE (MATCH(asiasanat) AGAINST(${hakusana}))`

    switch (kohde) {
        case "merkinNimi":
            postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE (MATCH(merkinNimi) AGAINST(${hakusana}))`
            break;
            
        case "taiteilija":
            postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE (MATCH(taiteilija) AGAINST(${hakusana}))`
            break;
    }
    res.json(postimerkit);
    
    }
});

export default apiRouter;