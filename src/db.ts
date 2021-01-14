import { Teacher } from './models';

const { Pool } = require('pg')
const { clearEmpties } = require('./utils');
require('dotenv').config()


const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
})

const query = (text: string, params: any[]) => {
    return pool.query(text, params)
};

interface QueryParams {
    [key: string]: string;
}

const serializeQuery = (obj: { [key: string]: any }): string => {
    const queries: string[] = [];
    Object.keys(obj).forEach((q, i) => queries.push(`${q} = $${i + 1}`));
    return queries.join(', ')
}

const serializeQueryParams = (queryParams: QueryParams): { text: string, params: any[] } => {
    if (!Object.keys(queryParams).length) {
        return {
            text: 'SELECT * FROM teacher',
            params: []
        }
    }
    const queries: string[] = [];
    const params = Object.values(queryParams).map(v => {
        const match = v.match(/\d/);
        if (match) {
            v = v.slice(match.index);
        }
        return v.split(',');
    }).flat();
    const start = 'SELECT * FROM teacher WHERE ';
    Object.keys(queryParams).forEach((key, ind) => {
        if (key === 'age' || key === 'years_of_experience') {
            const match = queryParams[key].match(/<\d+|>\d+|<=\d+|>=\d+/)
            queries.push(`${key} ${match ? match[0].split(/\d/)[0] : '='} $${ind + 1}`)
        }
        if (key === 'sex') {
            queries.push(`${key} = $${ind + 1}`)
        }
        if (key === 'can_teach_subjects' || key === 'worked_in_universities') {
            const possibleFields = {
                can_teach_subjects: ['subject_id', 'subject'],
                worked_in_universities: ['university_id', 'university']
            }
            const values = queryParams[key]
                .split(',')
                .map((value, i) =>
                    `(SELECT ${possibleFields[key][0]} FROM ${possibleFields[key][1]} WHERE name ILIKE $${ind + i + 1}) = ANY (${key})`)
            const result = values.join(' OR ')
            queries.push('('.concat(result, ')'))
        }
    })
    const text = start.concat(queries.join(' AND '));
    return {
        text,
        params
    }
}

const getAllTeachers = async (queryParams: QueryParams): Promise<Teacher[]> => {
    const { text, params } = serializeQueryParams(queryParams);
    const teachers = await query(text, params);
    const { rows } = teachers;
    return rows;
}

const getTargetMathTeachers = async (): Promise<Teacher[]> => {
    const text = 'SELECT DISTINCT ON(teacher_id) teacher_id, teacher.name, surname, years_of_experience, classroom.classroom, day_of_week, start_time, end_time' +
        ' FROM schedule\n' +
        'JOIN teacher\n' +
        'ON teacher.t_id = schedule.teacher_id\n' +
        'JOIN subject\n' +
        'ON subject.subject_id = schedule.subject_id\n' +
        'JOIN classroom\n' +
        'ON classroom.classroom_id = schedule.classroom_id\n' +
        'WHERE subject.name = $1\n' +
        'AND day_of_week = $2\n' +
        'AND classroom = $3\n' +
        'AND years_of_experience > $4\n' +
        'AND start_time >= $5\n' +
        'AND end_time <= $6'
    const params: any[] = [
        'Math',
        'thursday',
        100,
        4,
        '08:30',
        '14:30'
    ];
    const teachers = await query(text, params);
    const { rows } = teachers;
    return rows;
}

const addTeacher = async (teacher: Teacher): Promise<Teacher[]> => {
    const {
        name,
        surname,
        age,
        can_teach_subjects,
        email,
        phone_number,
        sex,
        worked_in_universities,
        years_of_experience
    } = teacher;
    const text = 'INSERT INTO teacher(name, \n' +
        ' surname,\n' +
        ' phone_number,\n' +
        ' email,\n' +
        ' age,\n' +
        ' sex,\n' +
        ' years_of_experience, \n' +
        ' worked_in_universities \n' +
        ' can_teach_subjects) \n' +
        ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)\n' +
        ' RETURNING *';
    const params = [name, surname, phone_number, email, age, sex, years_of_experience, worked_in_universities, can_teach_subjects];
    const res = await query(text, params);
    return res.rows;
}

const updateTeacher = async (teacher: Partial<Teacher>, id: string): Promise<Teacher[]> => {
    const start = 'UPDATE teacher\n' +
        'SET ';
    const end = `WHERE t_id = ${id} RETURNING *`
    const text = start.concat(serializeQuery(teacher), end);
    const params = Object.values(clearEmpties(teacher));
    const res = await query(text, params);
    return res.rows;
}

const deleteTeacher = async (id: string) => {
    const text = 'DELETE FROM teacher WHERE t_id = $1 RETURNING *';
    const params = [id];
    const res = await query(text, params);
    return res.rows;
}

module.exports = {
    getAllTeachers,
    getTargetMathTeachers,
    addTeacher,
    deleteTeacher,
    updateTeacher
}



