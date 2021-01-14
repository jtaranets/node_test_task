enum Gender {
    'woman',
    'man'
}

enum SubjectOptions {
    'Biology',
    'Math',
    'Physics',
    'Chemistry'
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

export interface Teacher {
    t_id?: number;
    name: string;
    surname: string;
    phone_number: string;
    email: string;
    age: number,
    sex: keyof typeof Gender,
    years_of_experience: number,
    worked_in_universities: string[],
    can_teach_subjects: number[];
}

export interface Lesson {
    day_of_week: DayOfWeek;
    start_time: string;
    classroom_id: number;
    teacher_id: number;
    subject_id: number;
    student_group: number;
    end_time: string;
}

export interface Classroom {
    classroom_id?: number,
    classroom: number
}

export interface Subject {
    subject_id?: number;
    subject: keyof typeof SubjectOptions;
}
