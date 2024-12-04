function loadProfile() {
    const nic = localStorage.getItem('currentStudentNIC');
    if (!nic) {
        console.error('No NIC found in local storage.');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.nic === nic);

    if (!student) {
        console.error('No student found with the NIC:', nic);
        return;
    }

    document.getElementById('profileNameDisplay').innerText = student.name;
    document.getElementById('profileNICDisplay').innerText = student.nic;
    document.getElementById('profileDOBDisplay').innerText = student.dob;
    document.getElementById('profileAgeDisplay').innerText = student.age;
    document.getElementById('profileAddressDisplay').innerText = student.address;
}

function openUpdateProfileModal() {
    const nic = localStorage.getItem('currentStudentNIC');
    if (!nic) {
        console.error('No NIC found in local storage.');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.nic === nic);

    if (!student) {
        console.error('No student found with the NIC:', nic);
        return;
    }

    document.getElementById('updateProfileName').value = student.name;
    document.getElementById('updateProfileNIC').value = student.nic;
    document.getElementById('updateProfileDOB').value = student.dob;
    document.getElementById('updateProfileAge').value = student.age;
    document.getElementById('updateProfileAddress').value = student.address;

    document.getElementById('updateProfileModal').style.display = 'block';
}

function closeUpdateProfileModal() {
    document.getElementById('updateProfileModal').style.display = 'none';
}

function updateProfile() {
    const nic = localStorage.getItem('currentStudentNIC');
    if (!nic) {
        console.error('No NIC found in local storage.');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(student => student.nic === nic);

    if (studentIndex === -1) {
        console.error('No student found with the NIC:', nic);
        return;
    }

    const studentName = document.getElementById('updateProfileName').value.trim();
    const studentDOB = document.getElementById('updateProfileDOB').value.trim();
    const studentAge = document.getElementById('updateProfileAge').value.trim();
    const studentAddress = document.getElementById('updateProfileAddress').value.trim();
    const studentPassword = document.getElementById('updateProfilePassword').value.trim();
    const studentConfirmPassword = document.getElementById('updateProfileConfirmPassword').value.trim();

    if (studentPassword !== studentConfirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    students[studentIndex] = {
        ...students[studentIndex],
        name: studentName,
        dob: studentDOB,
        age: studentAge,
        address: studentAddress,
        password: studentPassword ? btoa(studentPassword) : students[studentIndex].password
    };

    localStorage.setItem('students', JSON.stringify(students));
    alert('Profile updated successfully!');
    closeUpdateProfileModal();
    loadProfile();
}

function loadCourses() {
    const nic = localStorage.getItem('currentStudentNIC');
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.nic === nic);
    if (student) {
        const studentCoursesTable = document.getElementById('studentCoursesTable').getElementsByTagName('tbody')[0];
        studentCoursesTable.innerHTML = '';
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        student.courses.forEach(courseId => {
            const course = courses.find(course => course.id === courseId);
            const row = studentCoursesTable.insertRow();
            row.insertCell(0).innerText = course.id;
            row.insertCell(1).innerText = course.name;
            row.insertCell(2).innerText = course.period;
            row.insertCell(3).innerText = course.level;
            row.insertCell(4).innerText = course.fee;
        });
    }
}

function loadNotifications() {
    const nic = localStorage.getItem('currentStudentNIC');
    if (!nic) {
        console.error('No NIC found in local storage.');
        return;
    }

    const notifications = JSON.parse(localStorage.getItem('notifications')) || {};
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';

    const studentNotifications = notifications[nic] || [];
    studentNotifications.forEach(notification => {
        const listItem = document.createElement('li');
        listItem.innerText = notification;
        notificationsList.appendChild(listItem);
    });
}

function loadPayments() {
    const nic = localStorage.getItem('currentStudentNIC');
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.nic === nic);
    if (student) {
        const studentPaymentsTable = document.getElementById('studentPaymentsTable').getElementsByTagName('tbody')[0];
        studentPaymentsTable.innerHTML = '';
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        student.courses.forEach(courseId => {
            const course = courses.find(course => course.id === courseId);
            const row = studentPaymentsTable.insertRow();
            row.insertCell(0).innerText = course.name;
            row.insertCell(1).innerText = course.fee;
            row.insertCell(2).innerText = 'Pending';
            row.insertCell(3).innerText = new Date().toLocaleDateString();
        });
    }
}

function populateCoursesFromAdminPage() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const coursesContainer = document.getElementById('corsesFromAdminPage');
    coursesContainer.innerHTML = '';

    if (courses.length > 0) {
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';

            const courseName = document.createElement('h3');
            courseName.innerText = course.name;

            const coursePeriod = document.createElement('p');
            coursePeriod.innerText = `Period: ${course.period}`;

            const courseLevel = document.createElement('p');
            courseLevel.innerText = `Level: ${course.level}`;

            const courseFee = document.createElement('p');
            courseFee.innerText = `Fee: $${course.fee}`;

            card.appendChild(courseName);
            card.appendChild(coursePeriod);
            card.appendChild(courseLevel);
            card.appendChild(courseFee);

            coursesContainer.appendChild(card);
        });
    } else {
        coursesContainer.innerHTML = '<p>No courses available at the moment. Please contact admin for more details.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadCourses();
    loadNotifications();
    loadPayments();
    populateCoursesFromAdminPage();
});
