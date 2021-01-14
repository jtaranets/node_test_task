import { Request, Response, Router } from 'express';

const express = require('express');
const router = Router();
const { getAllTeachers, getTargetMathTeachers, addTeacher, deleteTeacher, updateTeacher } = require('./db');

const app = express();
require('dotenv').config()

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/teacher', router);

const sendError = (e: Error, res: Response) => {
    console.log(e);
    res.status(500).send();
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const params = req.query;
        const teachers = await getAllTeachers(params);
        res.send(teachers);
    } catch (e) {
        sendError(e, res);
    }
});

router.get('/target', async (req: Request, res: Response) => {
    try {
        const teachers = await getTargetMathTeachers();
        res.send(teachers);
    } catch (e) {
        sendError(e, res);
    }
});
router.post('/', async (req: Request, res: Response) => {
   const teacher = req.body;
   try {
       const teachers = await addTeacher(teacher);
       res.status(201).send(teachers[0]);
   } catch (e) {
       sendError(e, res);
   }
});

router.put('/:id', async (req: Request, res: Response) => {
    const teacher = req.body;
    try {
        const teachers = await updateTeacher(teacher, req.params.id);
        res.send(teachers[0])
    } catch (e) {
        sendError(e, res);
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const teachers = await deleteTeacher(req.params.id);
        res.send(teachers[0]);
    } catch (e) {
        sendError(e, res);
    }
})

app.listen(port, () => console.log(`port is listening on ${port}`))







