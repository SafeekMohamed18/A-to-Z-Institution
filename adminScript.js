document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    displayStudents();
    loadAllStudents();
    updateReports();
    displayCourses();  // Ensure courses are displayed on page load
});

// Function to add a course
function addCourse() {
    const courseId = document.getElementById('courseId').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const coursePeriod = document.getElementById('coursePeriod').value;
    const courseLevel = document.getElementById('courseLevel').value;
    const courseFee = document.getElementById('courseFee').value.trim();

    if (!courseId || !courseName || !courseFee) {
        alert("All fields must be filled out.");
        return;
    }

    let courses = JSON.parse(localStorage.getItem('courses')) || [];

    if (courses.find(course => course.id === courseId)) {
        alert("Course ID must be unique.");
        return;
    }

    courses.push({ id: courseId, name: courseName, period: coursePeriod, level: courseLevel, fee: courseFee });
    localStorage.setItem('courses', JSON.stringify(courses));
    displayCourses();

    // Clear form fields after adding a course
    document.getElementById('courseId').value = '';
    document.getElementById('courseName').value = '';
    document.getElementById('coursePeriod').value = '6 months';
    document.getElementById('courseLevel').value = 'beginner';
    document.getElementById('courseFee').value = '';

    toggleCourseForm();  // Hide the form after adding a course
}

// Function to display courses in the table
function displayCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const coursesTable = document.getElementById('coursesTable').getElementsByTagName('tbody')[0];
    coursesTable.innerHTML = '';

    courses.forEach(course => {
        const row = coursesTable.insertRow();
        row.insertCell(0).innerText = course.id;
        row.insertCell(1).innerText = course.name;
        row.insertCell(2).innerText = course.period;
        row.insertCell(3).innerText = course.level;
        row.insertCell(4).innerText = course.fee;

        const actionCell = row.insertCell(5);
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = () => editCourse(course.id);
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteCourse(course.id);
        actionCell.appendChild(deleteButton);
    });
}

// Function to toggle the course form
function toggleCourseForm() {
    const courseFormSection = document.getElementById('manage-courses');
    const showCourseFormButton = document.getElementById('showCourseFormButton');
    courseFormSection.style.display = courseFormSection.style.display === 'none' || courseFormSection.style.display === '' ? 'block' : 'none';
    showCourseFormButton.style.display = courseFormSection.style.display === 'block' ? 'none' : 'block';

    // Clear form fields whenever the form is toggled to be visible
    if (courseFormSection.style.display === 'block') {
        document.getElementById('courseId').value = '';
        document.getElementById('courseName').value = '';
        document.getElementById('coursePeriod').value = '6 months';
        document.getElementById('courseLevel').value = 'beginner';
        document.getElementById('courseFee').value = '';
    }
}

// Function to delete a course
function deleteCourse(courseId) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses = courses.filter(course => course.id !== courseId);
    localStorage.setItem('courses', JSON.stringify(courses));
    displayCourses();
}


// Function to load courses into checkboxes
function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseCheckboxes = document.getElementById('courseCheckboxes');
    courseCheckboxes.innerHTML = '';

    courses.forEach(course => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `course-${course.id}`;
        checkbox.value = course.id;

        const label = document.createElement('label');
        label.htmlFor = `course-${course.id}`;
        label.textContent = `${course.name} - ${course.period} - ${course.level} (Fee: ${course.fee})`;

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);

        courseCheckboxes.appendChild(div);
    });
}

// Function to register a student
function registerStudent() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentNIC = document.getElementById('studentNIC').value.trim();
    const studentDOB = document.getElementById('studentDOB').value.trim();
    const studentAge = document.getElementById('studentAge').value.trim();
    const studentAddress = document.getElementById('studentAddress').value.trim();
    const studentPassword = btoa(document.getElementById('studentPassword').value.trim());
    const studentConfirmPassword = btoa(document.getElementById('studentConfirmPassword').value.trim());
    const studentAdmissionFee = document.getElementById('studentAdmissionFee').value.trim();

    const selectedCourses = Array.from(document.querySelectorAll('#courseCheckboxes input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    if (!studentNIC || studentNIC.length !== 12) {
        alert('NIC number must have exactly 12 characters.');
        return;
    }

    if (studentPassword !== studentConfirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    let students = JSON.parse(localStorage.getItem('students')) || [];

    if (students.find(student => student.nic === studentNIC)) {
        alert('NIC must be unique.');
        return;
    }

    students.push({
        name: studentName,
        nic: studentNIC,
        dob: studentDOB,
        age: studentAge,
        address: studentAddress,
        password: studentPassword,
        admissionFee: studentAdmissionFee,
        courses: selectedCourses
    });

    localStorage.setItem('students', JSON.stringify(students));
    displayStudents();
    toggleForm();
}

// Function to display students in the table
function displayStudents() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const studentsTable = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
    studentsTable.innerHTML = '';

    students.forEach((student, index) => {
        const row = studentsTable.insertRow();
        row.insertCell(0).innerText = student.nic;
        row.insertCell(1).innerText = student.name;
        row.insertCell(2).innerText = student.dob;
        row.insertCell(3).innerText = student.age;
        row.insertCell(4).innerText = student.address;
        row.insertCell(5).innerText = student.admissionFee;

        const courseNames = student.courses.map(courseId => {
            const course = courses.find(course => course.id === courseId);
            return course ? course.name : '';
        }).join(', ');
        row.insertCell(6).innerText = courseNames;

        const editCell = row.insertCell(7);
        const deleteCell = row.insertCell(8);

        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.innerText = 'Edit';
        editButton.onclick = () => editStudent(index);
        editCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteStudent(student.nic);
        deleteCell.appendChild(deleteButton);
    });
}

// Function to edit a student
function editStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    document.getElementById('studentName').value = student.name;
    document.getElementById('studentNIC').value = student.nic;
    document.getElementById('studentDOB').value = student.dob;
    document.getElementById('studentAge').value = student.age;
    document.getElementById('studentAddress').value = student.address;
    document.getElementById('studentAdmissionFee').value = student.admissionFee;
    document.getElementById('studentPassword').value = atob(student.password);
    document.getElementById('studentConfirmPassword').value = atob(student.password);

    const courseCheckboxes = document.querySelectorAll('#courseCheckboxes input[type="checkbox"]');
    courseCheckboxes.forEach(checkbox => {
        checkbox.checked = student.courses.includes(checkbox.value);
    });

    toggleForm();

    const submitButton = document.querySelector('#register-students button');
    submitButton.innerText = 'Save Changes';
    submitButton.onclick = () => updateStudent(index);
}

// Function to update a student after editing
function updateStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    student.name = document.getElementById('studentName').value.trim();
    student.nic = document.getElementById('studentNIC').value.trim();
    student.dob = document.getElementById('studentDOB').value.trim();
    student.age = document.getElementById('studentAge').value.trim();
    student.address = document.getElementById('studentAddress').value.trim();
    student.password = btoa(document.getElementById('studentPassword').value.trim());
    student.admissionFee = document.getElementById('studentAdmissionFee').value.trim();
    student.courses = Array.from(document.querySelectorAll('#courseCheckboxes input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    localStorage.setItem('students', JSON.stringify(students));
    displayStudents();
    toggleForm();

    const submitButton = document.querySelector('#register-students button');
    submitButton.innerText = 'Submit';
    submitButton.onclick = registerStudent;
}

// Function to delete a student
function deleteStudent(nic) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(student => student.nic !== nic);
    localStorage.setItem('students', JSON.stringify(students));
    displayStudents();
}

// Function to toggle the student registration form visibility
function toggleForm() {
    const formSection = document.getElementById('register-students');
    const showFormButton = document.getElementById('showFormButton');
    formSection.style.display = formSection.style.display === 'none' || formSection.style.display === '' ? 'block' : 'none';
    showFormButton.style.display = formSection.style.display === 'block' ? 'none' : 'block';
}

// Function to calculate total pending amount for a student
function calculatePendingAmount(student) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    let totalPending = 0;

    student.courses.forEach(courseId => {
        const course = courses.find(course => course.id === courseId);
        if (course) {
            const studentPayments = payments.filter(payment => payment.nic === student.nic && payment.courseId === courseId);
            const totalPaid = studentPayments.reduce((sum, payment) => sum + parseFloat(payment.amountPaid), 0);
            totalPending += (parseFloat(course.fee) - totalPaid);
        }
    });

    return totalPending;
}

// Function to load all students and display payment details
function loadAllStudents() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const paymentsTable = document.getElementById('paymentsTable').getElementsByTagName('tbody')[0];
    paymentsTable.innerHTML = '';

    students.forEach(student => {
        const totalPending = calculatePendingAmount(student);
        const row = paymentsTable.insertRow();
        row.insertCell(0).innerText = student.nic;
        row.insertCell(1).innerText = student.name;
        row.insertCell(2).innerText = student.courses.map(courseId => {
            const course = courses.find(course => course.id === courseId);
            return course ? course.name : '';
        }).join(', ');
        row.insertCell(3).innerText = totalPending.toFixed(2);
        row.insertCell(4).innerHTML = totalPending > 0 ? `<button class="pay-now-button" onclick="openPaymentPopup('${student.nic}', ${totalPending})">Add Payment</button>` : 'No Pending Payments';
    });
}

// Function to open payment popup
function openPaymentPopup(nic, totalPending) {
    const amountToPay = prompt(`Total pending amount: ${totalPending}. Enter amount to pay:`);

    if (!amountToPay || isNaN(amountToPay) || parseFloat(amountToPay) <= 0) {
        alert('Invalid payment amount.');
        return;
    }

    makePayment(nic, parseFloat(amountToPay));
}

// Function to record payment
function makePayment(nic, amountPaid) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const payments = JSON.parse(localStorage.getItem('payments')) || [];

    const student = students.find(student => student.nic === nic);
    let remainingAmount = amountPaid;

    student.courses.forEach(courseId => {
        const course = courses.find(course => course.id === courseId);
        if (course && remainingAmount > 0) {
            const studentPayments = payments.filter(payment => payment.nic === student.nic && payment.courseId === courseId);
            const totalPaid = studentPayments.reduce((sum, payment) => sum + parseFloat(payment.amountPaid), 0);
            const pendingForCourse = parseFloat(course.fee) - totalPaid;

            if (pendingForCourse > 0) {
                const paymentAmount = Math.min(remainingAmount, pendingForCourse);
                remainingAmount -= paymentAmount;

                if (studentPayments.length > 0) {
                    studentPayments[0].amountPaid += paymentAmount;
                    studentPayments[0].status = studentPayments[0].amountPaid >= parseFloat(course.fee) ? 'Paid' : 'Partially Paid';
                } else {
                    payments.push({
                        nic: nic,
                        courseId: courseId,
                        amountPaid: paymentAmount,
                        status: paymentAmount === pendingForCourse ? 'Paid' : 'Partially Paid'
                    });
                }
            }
        }
    });

    localStorage.setItem('payments', JSON.stringify(payments));
    alert('Payment recorded successfully!');
    loadAllStudents();
}

// Function to search payments by NIC
function searchPayments() {
    const searchNIC = document.getElementById('searchNIC').value.trim();
    if (!searchNIC) {
        alert('Please enter a NIC number.');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.nic === searchNIC);
    if (!student) {
        alert('No student found with the provided NIC.');
        return;
    }

    const paymentsTable = document.getElementById('paymentsTable').getElementsByTagName('tbody')[0];
    paymentsTable.innerHTML = '';

    const totalPending = calculatePendingAmount(student);
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    student.courses.forEach(courseId => {
        const course = courses.find(course => course.id === courseId);
        if (course) {
            const studentPayments = payments.filter(payment => payment.nic === student.nic && payment.courseId === courseId);
            const totalPaid = studentPayments.reduce((sum, payment) => sum + parseFloat(payment.amountPaid), 0);
            const pendingForCourse = parseFloat(course.fee) - totalPaid;

            const row = paymentsTable.insertRow();
            row.insertCell(0).innerText = student.nic;
            row.insertCell(1).innerText = student.name;
            row.insertCell(2).innerText = course.name;
            row.insertCell(3).innerText = pendingForCourse.toFixed(2);
            row.insertCell(4).innerHTML = pendingForCourse > 0 ? `<button class="pay-now-button" onclick="openPaymentPopup('${student.nic}', ${pendingForCourse})">Add Payment</button>` : 'No Pending Payments';
        }
    });

    if (totalPending === 0) {
        const row = paymentsTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 5;
        cell.innerText = 'No pending payments found for this student.';
        cell.style.textAlign = 'center';
    }
}

// Function to update the reports section
function updateReports() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const payments = JSON.parse(localStorage.getItem('payments')) || [];

    const totalStudents = students.length;
    document.getElementById('totalStudents').innerText = totalStudents;

    const totalCourses = courses.length;
    document.getElementById('totalCourses').innerText = totalCourses;

    let totalRevenue = 0;
    let totalPendingPayments = 0;

    students.forEach(student => {
        totalRevenue += parseFloat(student.admissionFee) || 0;

        student.courses.forEach(courseId => {
            const course = courses.find(course => course.id === courseId);
            if (course) {
                const studentPayments = payments.filter(payment => payment.nic === student.nic && payment.courseId === courseId);
                const totalPaid = studentPayments.reduce((sum, payment) => sum + parseFloat(payment.amountPaid), 0);
                totalRevenue += totalPaid;
                totalPendingPayments += (parseFloat(course.fee) - totalPaid);
            }
        });
    });

    document.getElementById('totalRevenue').innerText = totalRevenue.toFixed(2);
    document.getElementById('totalPendingPayments').innerText = totalPendingPayments.toFixed(2);

    const studentsPerCourseList = document.getElementById('studentsPerCourse');
    studentsPerCourseList.innerHTML = '';

    courses.forEach(course => {
        const studentsInCourse = students.filter(student => student.courses.includes(course.id));
        const listItem = document.createElement('li');
        listItem.innerText = `${course.name}: ${studentsInCourse.length} students`;
        studentsPerCourseList.appendChild(listItem);
    });
}

// Function to send notifications
function sendNotification() {
    const notificationNIC = document.getElementById('notificationNIC').value;
    const notificationText = document.getElementById('notificationText').value;

    let notifications = JSON.parse(localStorage.getItem('notifications')) || {};
    if (!notifications[notificationNIC]) {
        notifications[notificationNIC] = [];
    }
    notifications[notificationNIC].push(notificationText);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    alert('Notification sent!');
}

