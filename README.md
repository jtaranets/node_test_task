# node_test_task

The app is started by running `npm run dev` and will open on `localhost:5000`.

Endpoing by which it's possible to get all teachers is `/teacher`, where you can additionally provide query parameters.

It's possible to filter teacher by categories: *age, years_of_experience, sex, can_teach_subjects, worked_in_universities*.

To filter teachers by numerical values, such as *age* or *years_of_experience*, you can provide an absolute number you want to filter by, for instance `/teacher?age=70`
or you can add comparison operators like so: `/teacher?age=<70 | /teacher?age=<=70 | /teacher?age=>70 | /teacher?age=>=70`.

To filter teachers by *sex* use either `woman` or `man` parameter like so `/teacher?sex=man`.

To filter by *can_teach_subjects* or *worked_in_universities* you can provide one or multiple values separeted by come like so `/teacher?can_teach_subjects=Math` or
`/teacher?can_teach_subjects=Math,Physics`. Available values for now are: 

for *can_teach_subjects*: Literature, Math, Biology, Chemistry, Physics

for *worked_in_universities*: KNEU, KMA

