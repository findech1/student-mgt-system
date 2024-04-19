const form = document.getElementById('studentForm');
const studentsList = document.getElementById('studentsList');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const grade = document.getElementById('grade').value;
    const response = await fetch('/addStudent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, age, grade })
    });
    const message = await response.text();
    alert(message);
    if (response.ok) {
        getStudents();
        form.reset();
    }
});

async function getStudents() {
    studentsList.innerHTML = '';
    const response = await fetch('/students');
    const students = await response.json();
    students.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.innerHTML = `
            <p>Name: ${student.name}</p>
            <p>Age: ${student.age}</p>
            <p>Grade: ${student.grade}</p>
            <button onclick="editStudent(${student.id})">Edit</button>
            <button onclick="deleteStudent(${student.id})">Delete</button>
        `;
        studentsList.appendChild(studentItem);
    });
}

async function editStudent(id) {
    const response = await fetch(`/getStudent/${id}`);
    const student = await response.json();

    const editForm = document.createElement('form');
    editForm.id = 'editStudentForm';

    const nameInput = document.createElement('input');
    nameInput.id = 'editName';
    nameInput.value = student.name;

    const ageInput = document.createElement('input');
    ageInput.id = 'editAge';
    ageInput.value = student.age;

    const gradeInput = document.createElement('input');
    gradeInput.id = 'editGrade';
    gradeInput.value = student.grade;

    const submitButton = document.createElement('button');
    submitButton.innerHTML = 'Update';
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const name = document.getElementById('editName').value;
        const age = document.getElementById('editAge').value;
        const grade = document.getElementById('editGrade').value;
        const response = await fetch(`/updateStudent/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, age, grade })
        });
        const message = await response.text();
        alert(message);
        if (response.ok) {
            getStudents();
        }
    });

    editForm.appendChild(nameInput);
    editForm.appendChild(ageInput);
    editForm.appendChild(gradeInput);
    editForm.appendChild(submitButton);

    const editModal = document.createElement('div');
    editModal.id = 'editModal';
    editModal.appendChild(editForm);

    document.body.appendChild(editModal);
}

async function deleteStudent(id) {
    await fetch(`/deleteStudent/${id}`, {
        method: 'DELETE'
    });
    getStudents();
}

getStudents();