document.addEventListener('DOMContentLoaded', function() {
    const appDiv = document.getElementById('app');
    let currentUser = null;

    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        return Promise.reject('Страница не найдена');
                    } else {
                        return Promise.reject('Ошибка загрузки: ' + response.status);
                    }
                }
                return response.text();
            })
            .then(html => {
                appDiv.innerHTML = html;
                initPageScripts();
            })
            .catch(error => {
                console.error('Ошибка загрузки:', error);
                appDiv.innerHTML = '<p>Ошибка загрузки контента: ' + error + '</p>';
            });
    }

    function initPageScripts() {
        // --- Modal functions (add/edit user, report) ---
        // (This part remains largely the same as in the previous response)
        let addUserButton = document.getElementById('addUserButton');
        let addUserModal = document.getElementById('addUserModal');
        let addUserClose = document.getElementById('addUserClose');
        let addRoleSelect = document.querySelector('#addUserModal select[name="role"]');
        let addStudentFields = document.getElementById('studentFields');
        if(addUserButton){
            addUserButton.addEventListener('click', () => {
                addUserModal.style.display = 'block';
            });
            addUserClose.addEventListener('click', () => {
                addUserModal.style.display = 'none';
            });
            window.addEventListener('click', (event) => {
                if (event.target === addUserModal) {
                    addUserModal.style.display = 'none';
                }
            });
            addRoleSelect.addEventListener('change', function() {
                if (this.value === 'student') {
                    addStudentFields.style.display = 'block';
                } else {
                    addStudentFields.style.display = 'none';
                }
            });
        }
        // Edit User Modal
        let editUserModal = document.getElementById('editUserModal');
        let editUserClose = document.getElementById('editUserClose');
        let editRoleSelect = document.querySelector('#editUserModal select[name="role"]');
        let editStudentFields = document.getElementById('studentEditFields');
        if(editUserModal){
            editUserClose.addEventListener('click', () => {
                editUserModal.style.display = 'none';
            });
            window.addEventListener('click', (event) => {
                if (event.target === editUserModal) {
                    editUserModal.style.display = 'none';
                }
            });
            editRoleSelect.addEventListener('change', function() {
                if (this.value === 'student') {
                    editStudentFields.style.display = 'block';
                } else {
                    editStudentFields.style.display = 'none';
                }
            });
        }
        function openEditModal(id, login, name, role, classValue, letter) {
            document.getElementById('editId').value = id;
            document.getElementById('editLogin').value = login;
            document.getElementById('editPassword').value = '';
            document.getElementById('editName').value = name;
            document.getElementById('editRole').value = role;
            if(role === 'student'){
                editStudentFields.style.display = 'block';
                document.getElementById('editClass').value = classValue;
                document.getElementById('editLetter').value = letter;
            }else{
                editStudentFields.style.display = 'none';
                document.getElementById('editClass').value = '';
                document.getElementById('editLetter').value = '';
            }
            editUserModal.style.display = 'block';
        }
        window.openEditModal = openEditModal;
        //Report modal
        let addReportButton = document.getElementById('addReportButton');
        let addReportModal = document.getElementById('addReportModal');
        let addReportClose = document.getElementById('addReportClose');
        if(addReportButton){
            addReportButton.addEventListener('click', () => {
                addReportModal.style.display = 'block';
            });
            addReportClose.addEventListener('click', () => {
                addReportModal.style.display = 'none';
            });
            window.addEventListener('click', (event) => {
                if (event.target === addReportModal) {
                    addReportModal.style.display = 'none';
                }
            });
        }
        //Edit Report Modal
        let editReportModal = document.getElementById('editReportModal');
        let editReportClose = document.getElementById('editReportClose');
        if(editReportModal){
            editReportClose.addEventListener('click', () => {
                editReportModal.style.display = 'none';
            });
            window.addEventListener('click', (event) => {
                if (event.target === editReportModal) {
                    editReportModal.style.display = 'none';
                }
            });
        }
        function openEditReportModal(id, name) {
            document.getElementById('editReportId').value = id;
            document.getElementById('editReportName').value = name;
            document.getElementById('editReportModal').style.display = 'block';
        }
        window.openEditReportModal = openEditReportModal;

        // --- User Management ---
        let addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                fetch('api/users.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        loadContent('admin/users.html');
                    } else {
                        alert(data.message || 'Ошибка при добавлении пользователя.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка сети при добавлении пользователя.');
                });
            });
        }
        let editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            editUserForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                fetch('api/users.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        loadContent('admin/users.html');
                    } else {
                        alert(data.message || 'Ошибка при редактировании пользователя.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка сети при редактировании пользователя.');
                });
            });
        }
        if(document.getElementById("usersTableBody")){
            function fetchUsers() {
                fetch('api/users.php?action=getUsers')
                    .then(response => response.json())
                    .then(data => {
                        const tableBody = document.getElementById('usersTableBody');
                        if(tableBody && data && data.users){
                            tableBody.innerHTML = ''; //Clear table body
                            data.users.forEach(user => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${user.id}</td>
                                    <td>${user.login}</td>
                                    <td>${user.name}</td>
                                    <td>${user.role}</td>
                                    <td>${user.class || ''}</td>
                                    <td>${user.letter || ''}</td>
                                    <td>
                                    <button onclick="openEditModal(${user.id}, '${user.login}', '${user.name}', '${user.role}', '${user.class || ''}', '${user.letter || ''}')">Редактировать</button>
                                    <a href="#" data-id="${user.id}" class="deleteUserButton"><i class="fa fa-trash"></i></a>
                                    </td>
                                `;
                                tableBody.appendChild(row);
                            });
                            initDeleteButtons();
                        }
                    })
                    .catch(error => console.error('Fetch Error:', error));
            }
            function initDeleteButtons() {
                const deleteButtons = document.querySelectorAll('.deleteUserButton');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const userId = e.target.parentElement.getAttribute('data-id');
                        if (confirm('Вы уверены, что хотите удалить пользователя с ID: ' + userId + '?')) {
                            fetch('api/users.php?action=deleteUser&id=' + userId, {
                                method: 'DELETE'
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    loadContent('admin/users.html');
                                } else {
                                    alert(data.message || 'Ошибка при удалении пользователя.');
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка:', error);
                                alert('Ошибка сети при удалении пользователя.');
                            });
                        }
                    });
                });
            }
            // Fetch users initially
            fetchUsers();
        }
        // --- Report Management ---
        let addReportForm = document.getElementById('addReportForm');
        if (addReportForm) {
            addReportForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                fetch('api/reports.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        loadContent('admin/reports.html');
                    } else {
                        alert(data.message || 'Ошибка при добавлении отчета.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка сети при добавлении отчета.');
                });
            });
        }
       let editReportForm = document.getElementById('editReportForm');
        if (editReportForm) {
            editReportForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                fetch('api/reports.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        loadContent('admin/reports.html');
                    } else {
                        alert(data.message || 'Ошибка при редактировании отчета.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка сети при редактировании отчета.');
                });
            });
        }
         if(document.getElementById('reportTableBody')){
            function fetchReports() {
                fetch('api/reports.php?action=getReports')
                    .then(response => response.json())
                    .then(data => {
                        const tableBody = document.getElementById('reportTableBody');
                        if(tableBody && data && data.reports){
                            tableBody.innerHTML = '';
                            data.reports.forEach(report => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${report.id}</td>
                                    <td>${report.name}</td>
                                    <td><a href="${report.file_path}" target="_blank" download>Скачать</a></td>
                                    <td>
                                        <button onclick="openEditReportModal(${report.id}, '${report.name}')">Редактировать</button>
                                        <a href="#" data-id="${report.id}" class="deleteReportButton"><i class="fa fa-trash"></i></a>
                                    </td>
                                `;
                                tableBody.appendChild(row);
                            });
                            initDeleteReportButtons();
                        }
                    })
                    .catch(error => console.error('Fetch Error:', error));
            }
            function initDeleteReportButtons() {
                 const deleteButtons = document.querySelectorAll('.deleteReportButton');
                 deleteButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const reportId = e.target.parentElement.getAttribute('data-id');
                        if (confirm('Вы уверены, что хотите удалить отчёт с ID: ' + reportId + '?')) {
                            fetch('api/reports.php?action=deleteReport&id='+reportId , {
                                method: 'DELETE',
                            }).then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    loadContent('admin/reports.html');
                                } else {
                                    alert(data.message || 'Ошибка при удалении отчёта.');
                                }
                            })
                            .catch(error => {
                                console.error('Fetch Error:', error);
                                alert('Ошибка сети при удалении отчёта.');
                            });
                        }
                    });
                });
           }
            fetchReports();
         }

        // --- Schedule Management (deputy) ---
         if(document.getElementById("scheduleTableBody")){
           function fetchSchedule() {
               fetch('api/schedule.php?action=getSchedule')
                 .then(response => response.json())
                 .then(data => {
                    const tableBody = document.getElementById('scheduleTableBody');
                     if(tableBody && data && data.schedule){
                       tableBody.innerHTML = '';
                           data.schedule.forEach(schedule => {
                             const row = document.createElement('tr');
                             row.innerHTML = `
                                 <td>${schedule.id}</td>
                                  <td>${schedule.class}</td>
                                 <td>${schedule.subject}</td>
                                <td>${schedule.time}</td>
                                  <td>${schedule.teacher}</td>
                                  <td>
                                   <button  onclick="openEditScheduleModal(${schedule.id}, '${schedule.class}', '${schedule.subject}', '${schedule.time}', '${schedule.teacher}')">Редактировать</button>
                                   <a href="#" data-id="${schedule.id}" class="deleteScheduleButton"><i class="fa fa-trash"></i></a>
                                  </td>
                              `;
                              tableBody.appendChild(row);
                           });
                          initDeleteScheduleButtons();
                       }
                  })
                  .catch(error => console.error('Fetch Error:', error));
             }

         fetchSchedule();
           function initDeleteScheduleButtons() {
             const deleteButtons = document.querySelectorAll('.deleteScheduleButton');
             deleteButtons.forEach(button => {
              button.addEventListener('click', (e) => {
                e.preventDefault();
                 const scheduleId = e.target.parentElement.getAttribute('data-id');
                 if (confirm('Вы уверены, что хотите удалить расписание с ID: ' + scheduleId + '?')) {
                     fetch('api/schedule.php?action=deleteSchedule&id='+scheduleId , {
                          method: 'DELETE',
                        }).then(response => response.json())
                       .then(data => {
                            if (data.success) {
                                loadContent('deputy/schedule.html');
                            } else {
                                  alert(data.message || 'Ошибка при удалении расписания.');
                            }
                        })
                      .catch(error => {
                        console.error('Fetch Error:', error);
                           alert('Ошибка сети при удалении расписания.');
                       });
                  }
              });
           });
        }
        }
        let addScheduleButton = document.getElementById('addScheduleButton');
        let addScheduleModal = document.getElementById('addScheduleModal');
         let addScheduleClose = document.getElementById('addScheduleClose');
        if(addScheduleButton){
            addScheduleButton.addEventListener('click', () => {
              addScheduleModal.style.display = 'block';
           });
          addScheduleClose.addEventListener('click', () => {
                addScheduleModal.style.display = 'none';
           });
           window.addEventListener('click', (event) => {
                if (event.target === addScheduleModal) {
                   addScheduleModal.style.display = 'none';
              }
           });
       }
        let editScheduleModal = document.getElementById('editScheduleModal');
        let editScheduleClose = document.getElementById('editScheduleClose');
        if(editScheduleModal){
            editScheduleClose.addEventListener('click', () => {
                 editScheduleModal.style.display = 'none';
           });
          window.addEventListener('click', (event) => {
            if (event.target === editScheduleModal) {
                editScheduleModal.style.display = 'none';
           }
       });
      }
          function openEditScheduleModal(id, classValue, subject, time, teacher) {
            document.getElementById('editScheduleId').value = id;
             document.getElementById('editScheduleClass').value = classValue;
              document.getElementById('editScheduleSubject').value = subject;
            document.getElementById('editScheduleTime').value = time;
           document.getElementById('editScheduleTeacher').value = teacher;
           document.getElementById('editScheduleModal').style.display = 'block';
         }
         window.openEditScheduleModal = openEditScheduleModal;
        let addScheduleForm = document.getElementById('addScheduleForm');
        if (addScheduleForm) {
            addScheduleForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                 fetch('api/schedule.php', {
                   method: 'POST',
                   body: formData,
                 })
               .then(response => response.json())
                 .then(data => {
                   if (data.success) {
                        loadContent('deputy/schedule.html');
                    } else {
                        alert(data.message || 'Ошибка при добавлении расписания.');
                   }
               })
                  .catch(error => {
                    console.error('Ошибка:', error);
                     alert('Ошибка сети при добавлении расписания.');
                  });
            });
         }
        let editScheduleForm = document.getElementById('editScheduleForm');
        if(editScheduleForm){
             editScheduleForm.addEventListener('submit', function(event) {
                event.preventDefault();
                 const formData = new FormData(this);
                 fetch('api/schedule.php', {
                     method: 'POST',
                      body: formData,
                 })
                    .then(response => response.json())
                 .then(data => {
                      if (data.success) {
                          loadContent('deputy/schedule.html');
                       } else {
                            alert(data.message || 'Ошибка при редактировании расписания.');
                        }
                    })
                   .catch(error => {
                     console.error('Ошибка:', error);
                     alert('Ошибка сети при редактировании расписания.');
                   });
            });
        }
         // --- Class Management (deputy) ---
        if(document.getElementById("classesTableBody")){
            function fetchClasses(){
               const classSelect = document.getElementById('classSelect');
               const subjectSelect = document.getElementById('subjectSelect');
               if(classSelect && subjectSelect){
                  classSelect.innerHTML = '';
                   subjectSelect.innerHTML = '';
                  fetch('api/classes.php?action=getClassesAndSubjects')
                     .then(response => response.json())
                      .then(data => {
                       if (data && data.classes){
                           const defaultOptionClass = document.createElement('option');
                             defaultOptionClass.value = '';
                             defaultOptionClass.textContent = 'Выберите класс';
                               classSelect.appendChild(defaultOptionClass);
                           data.classes.forEach(className =>{
                                 const option = document.createElement('option');
                                   option.value = className;
                                    option.textContent = className;
                                    classSelect.appendChild(option);
                             });

                       }
                          if(data && data.subjects){
                           const defaultOptionSubject = document.createElement('option');
                              defaultOptionSubject.value = '';
                              defaultOptionSubject.textContent = 'Выберите предмет';
                              subjectSelect.appendChild(defaultOptionSubject);
                            data.subjects.forEach(subject =>{
                                  const option = document.createElement('option');
                                    option.value = subject;
                                    option.textContent = subject;
                                     subjectSelect.appendChild(option);
                            });

                       }
                         if(classSelect.value && subjectSelect.value){
                             fetchClassMarks(classSelect.value, subjectSelect.value);
                        }
                    });
                  classSelect.addEventListener('change', () => {
                   if(classSelect.value && subjectSelect.value){
                          fetchClassMarks(classSelect.value, subjectSelect.value);
                       }
                   });
                    subjectSelect.addEventListener('change', () => {
                       if(classSelect.value && subjectSelect.value){
                            fetchClassMarks(classSelect.value, subjectSelect.value);
                        }
                    });
               }

           }
            function fetchClassMarks(selectedClass, selectedSubject){
                  fetch(`api/journal.php?action=getClassJournal&class=${selectedClass}&subject=${selectedSubject}`)
                  .then(response => response.json())
                    .then(data => {
                        const tableBody = document.getElementById('classesTableBody');
                         if(tableBody && data && data.marks){
                             tableBody.innerHTML = '';
                            if(data.marks.length > 0){
                                data.marks.forEach(mark => {
                                     const row = document.createElement('tr');
                                     row.innerHTML = `
                                         <td>${mark.student_name}</td>
                                       <td>${mark.mark}</td>
                                    `;
                                    tableBody.appendChild(row);
                                });
                           }else{
                                const row = document.createElement('tr');
                                  row.innerHTML =  `<td colspan="2"> Нет учеников или оценок по выбранному предмету.</td>`;
                                 tableBody.appendChild(row);
                             }
                         }
                    })
                     .catch(error => console.error('Fetch Error:', error));
              }
           fetchClasses();
       }
      // --- Poster Management (deputy) ---
        let uploadPosterForm = document.getElementById('uploadPosterForm');
        if (uploadPosterForm) {
            uploadPosterForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                 fetch('api/poster.php', {
                    method: 'POST',
                    body: formData
                })
                  .then(response => response.json())
                  .then(data => {
                     if (data.success) {
                           loadContent('deputy/poster.html');
                     } else {
                            alert(data.message || 'Ошибка при загрузке афиши.');
                       }
                  })
                   .catch(error => {
                        console.error('Ошибка:', error);
                         alert('Ошибка сети при загрузке афиши.');
                   });
            });
        }
       if(document.getElementById('posterImage')){
          function fetchPoster(){
             fetch('api/poster.php?action=getPoster')
               .then(response => response.json())
               .then(data =>{
                  if(data && data.poster_path){
                      document.getElementById('posterImage').src = data.poster_path;
                  }
              })
                .catch(error => console.error('Fetch Error:', error));
           }
            fetchPoster();
        }

        // --- Journal Management (teacher) ---
        if(document.getElementById("journalTableBody")){
            function fetchJournal(){
                const classSelect = document.getElementById('classSelect');
                const subjectSelect = document.getElementById('subjectSelect');
                if(classSelect && subjectSelect){
                  classSelect.innerHTML = '';
                    subjectSelect.innerHTML = '';
                    fetch('api/journal.php?action=getClassesAndSubjects')
                         .then(response => response.json())
                            .then(data => {
                               if (data && data.classes){
                                   const defaultOptionClass = document.createElement('option');
                                     defaultOptionClass.value = '';
                                       defaultOptionClass.textContent = 'Выберите класс';
                                    classSelect.appendChild(defaultOptionClass);
                                    data.classes.forEach(className =>{
                                        const option = document.createElement('option');
                                         option.value = className;
                                          option.textContent = className;
                                           classSelect.appendChild(option);
                                       });
                                 }
                                  if(data && data.subjects){
                                      const defaultOptionSubject = document.createElement('option');
                                        defaultOptionSubject.value = '';
                                        defaultOptionSubject.textContent = 'Выберите предмет';
                                          subjectSelect.appendChild(defaultOptionSubject);
                                       data.subjects.forEach(subject =>{
                                            const option = document.createElement('option');
                                           option.value = subject;
                                           option.textContent = subject;
                                            subjectSelect.appendChild(option);
                                       });
                                  }
                                if(classSelect.value && subjectSelect.value){
                                    fetchJournalData(classSelect.value, subjectSelect.value);
                                  }
                            });
                          classSelect.addEventListener('change', () => {
                            if(classSelect.value && subjectSelect.value){
                               fetchJournalData(classSelect.value, subjectSelect.value);
                             }
                          });
                       subjectSelect.addEventListener('change', () => {
                         if(classSelect.value && subjectSelect.value){
                             fetchJournalData(classSelect.value, subjectSelect.value);
                           }
                    });
                }

           }
            function fetchJournalData(selectedClass, selectedSubject) {
                fetch(`api/journal.php?action=getJournalData&class=${selectedClass}&subject=${selectedSubject}`)
                  .then(response => response.json())
                    .then(data => {
                        const tableBody = document.getElementById('journalTableBody');
                        if(tableBody && data && data.journal){
                            tableBody.innerHTML = '';
                            data.journal.forEach(item => {
                              const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${item.name}</td>
                                    <td>
                                        ${item.mark ? item.mark : '<button onclick="openAddMarkModal(\''+item.student_id+'\')">Добавить оценку</button>'}
                                      ${item.mark ? '<button onclick="openEditMarkModal(\''+item.journal_id+'\', \''+ item.mark +'\')">Редактировать</button>' : '' }
                                      ${item.mark ?  '<a href="#" data-id="'+item.journal_id+'" class="deleteMarkButton"><i class="fa fa-trash"></i></a>' : ''}
                                  </td>
                                 <td>
                                     <form method="post" id="attendanceForm${item.student_id}">
                                         <input type="hidden" name="student_id" value="${item.student_id}">
                                         <input type="checkbox" name="attendance" value="1" ${item.attendance_date ? 'checked' : ''} onchange="document.getElementById('attendanceForm${item.student_id}').submit()">
                                         <button type="submit"  style="display:none;"></button>
                                      </form>
                                    </td>
                                   <td>
                                      <button onclick="openAddHomeworkModal('${item.student_id}')">Загрузить ДЗ</button>
                                  </td>
                                   <td>
                                     ${item.homework_path ? '<a href="'+item.homework_path+'" download>Скачать ДЗ</a>' : ''}
                                 </td>
                                `;
                                tableBody.appendChild(row);
                            });
                             initDeleteMarkButtons();
                         }
                    })
                    .catch(error => console.error('Fetch Error:', error));
            }
            function initDeleteMarkButtons() {
               const deleteButtons = document.querySelectorAll('.deleteMarkButton');
                   deleteButtons.forEach(button => {
                     button.addEventListener('click', (e) => {
                          e.preventDefault();
                            const markId = e.target.parentElement.getAttribute('data-id');
                         if (confirm('Вы уверены, что хотите удалить оценку с ID: ' + markId + '?')) {
                             fetch('api/journal.php?action=deleteMark&id='+markId, {
                                   method: 'DELETE',
                                  })
                             .then(response => response.json())
                             .then(data => {
                                   if(data.success){
                                       const classSelect = document.getElementById('classSelect').value;
                                       const subjectSelect = document.getElementById('subjectSelect').value;
                                       fetchJournalData(classSelect, subjectSelect);
                                 }else{
                                       alert(data.message || 'Ошибка при удалении оценки.');
                                 }
                            })
                            .catch(error => {
                              console.error('Fetch Error:', error);
                                alert('Ошибка сети при удалении оценки.');
                            });
                        }
                    });
               });
           }
           function handleAttendance(studentId){
                fetch('api/journal.php?action=setAttendance', {
                    method: 'POST',
                   headers: {
                        'Content-Type': 'application/json',
                  },
                      body: JSON.stringify({student_id : studentId})
                }).then(response => response.json())
                 .then(data => {
                      if (!data.success) {
                           alert(data.message || 'Ошибка при изменении посещаемости.');
                       }else{
                           const classSelect = document.getElementById('classSelect').value;
                             const subjectSelect = document.getElementById('subjectSelect').value;
                           fetchJournalData(classSelect, subjectSelect);
                     }
                }).catch(error => {
                   console.error('Fetch Error:', error);
                   alert('Ошибка сети при изменении посещаемости.');
                });
             }
             appDiv.addEventListener('submit', function(event) {
                 if (event.target.id.startsWith('attendanceForm')) {
                     event.preventDefault();
                    const studentId = event.target.student_id.value;
                    handleAttendance(studentId);
                 }
             });
         function openAddMarkModal(studentId){
           document.getElementById('addMarkStudentId').value = studentId;
           document.getElementById('addMarkModal').style.display = 'block';
        }
        window.openAddMarkModal = openAddMarkModal;
        function openEditMarkModal(id, mark) {
            document.getElementById('editMarkId').value = id;
             document.getElementById('editMark').value = mark;
            document.getElementById('editMarkModal').style.display = 'block';
          }
          window.openEditMarkModal = openEditMarkModal;
           function openAddHomeworkModal(studentId) {
             document.getElementById('addHomeworkStudentId').value = studentId;
             document.getElementById('addHomeworkModal').style.display = 'block';
         }
         window.openAddHomeworkModal = openAddHomeworkModal;
         const addMarkModal = document.getElementById("addMarkModal");
          const editMarkModal = document.getElementById("editMarkModal");
          const addHomeworkModal = document.getElementById("addHomeworkModal");
          const close = document.querySelectorAll(".close");
            close.forEach(function(closeButton) {
                closeButton.onclick = function() {
                   addMarkModal.style.display = "none";
                      editMarkModal.style.display = "none";
                     addHomeworkModal.style.display = "none";
               }
            });
        window.onclick = function(event) {
           if (event.target == addMarkModal) {
                addMarkModal.style.display = "none";
             }
               if (event.target == editMarkModal) {
                  editMarkModal.style.display = "none";
                }
              if (event.target == addHomeworkModal) {
                addHomeworkModal.style.display = "none";
                }
        }
         let addMarkForm = document.getElementById('addMarkForm');
        if(addMarkForm){
             addMarkForm.addEventListener('submit', function(event){
                  event.preventDefault();
                 const formData = new FormData(this);
                   fetch('api/journal.php?action=addMark',{
                      method: 'POST',
                        body: formData
                 }).then(response => response.json())
                   .then(data => {
                       if(data.success){
                           const classSelect = document.getElementById('classSelect').value;
                         const subjectSelect = document.getElementById('subjectSelect').value;
                           fetchJournalData(classSelect, subjectSelect);
                          document.getElementById('addMarkModal').style.display = "none";
                      }else{
                          alert(data.message || 'Ошибка при добавлении оценки.');
                      }
                   })
                   .catch(error => {
                        console.error('Fetch Error:', error);
                      alert('Ошибка сети при добавлении оценки.');
                  });
             });
         }
         let editMarkForm = document.getElementById('editMarkForm');
         if(editMarkForm){
            editMarkForm.addEventListener('submit', function(event){
                event.preventDefault();
               const formData = new FormData(this);
                 fetch('api/journal.php?action=editMark',{
                      method: 'POST',
                       body: formData
                }).then(response => response.json())
                   .then(data => {
                       if(data.success){
                           const classSelect = document.getElementById('classSelect').value;
                          const subjectSelect = document.getElementById('subjectSelect').value;
                           fetchJournalData(classSelect, subjectSelect);
                          document.getElementById('editMarkModal').style.display = "none";
                       }else{
                          alert(data.message || 'Ошибка при редактировании оценки.');
                        }
                   })
                    .catch(error => {
                         console.error('Fetch Error:', error);
                           alert('Ошибка сети при редактировании оценки.');
                   });
             });
        }
       let addHomeworkForm = document.getElementById('addHomeworkForm');
       if(addHomeworkForm){
           addHomeworkForm.addEventListener('submit', function(event){
            event.preventDefault();
             const formData = new FormData(this);
               fetch('api/journal.php?action=addHomework',{
                method: 'POST',
                 body: formData
                }).then(response => response.json())
                    .then(data => {
                        if(data.success){
                            const classSelect = document.getElementById('classSelect').value;
                           const subjectSelect = document.getElementById('subjectSelect').value;
                           fetchJournalData(classSelect, subjectSelect);
                          document.getElementById('addHomeworkModal').style.display = "none";
                       }else{
                          alert(data.message || 'Ошибка при загрузке ДЗ.');
                       }
                })
                    .catch(error => {
                         console.error('Fetch Error:', error);
                       alert('Ошибка сети при загрузке ДЗ.');
                  });
             });
         }
          fetchJournal();
      }
      // --- Lesson Management (teacher) ---
        if(document.getElementById('lessonsTableBody')){
            function fetchLessons() {
                const subjectSelect = document.getElementById('subjectSelect');
                if(subjectSelect){
                   subjectSelect.innerHTML = '';
                    fetch('api/lesson.php?action=getSubjects')
                      .then(response => response.json())
                       .then(data => {
                         if(data && data.subjects){
                            const defaultOptionSubject = document.createElement('option');
                              defaultOptionSubject.value = '';
                              defaultOptionSubject.textContent = 'Выберите предмет';
                                 subjectSelect.appendChild(defaultOptionSubject);
                                 data.subjects.forEach(subject =>{
                                       const option = document.createElement('option');
                                      option.value = subject;
                                       option.textContent = subject;
                                        subjectSelect.appendChild(option);
                                  });
                            }
                         if(subjectSelect.value){
                              fetchLessonData(subjectSelect.value);
                           }
                         });
                      subjectSelect.addEventListener('change', function() {
                            if(subjectSelect.value){
                                 fetchLessonData(subjectSelect.value);
                            }
                        });
                    }
              }
            function fetchLessonData(selectedSubject){
                 fetch(`api/lesson.php?action=getLessonsData&subject=${selectedSubject}`)
                   .then(response => response.json())
                   .then(data => {
                        const tableBody = document.getElementById('lessonsTableBody');
                       if(tableBody && data && data.lessons){
                           tableBody.innerHTML = '';
                              data.lessons.forEach(lesson => {
                                const row = document.createElement('tr');
                                 row.innerHTML = `
                                      <td>${lesson.id}</td>
                                     <td>${lesson.theme}</td>
                                     <td>
                                       <button onclick="openEditLessonModal(${lesson.id}, '${lesson.theme}')">Редактировать</button>
                                         <a href="#" data-id="${lesson.id}" class="deleteLessonButton"><i class="fa fa-trash"></i></a>
                                       </td>
                                   `;
                                 tableBody.appendChild(row);
                               });
                            initDeleteLessonButtons();
                         }
                    })
                  .catch(error => console.error('Fetch Error:', error));
            }
            function initDeleteLessonButtons() {
                const deleteButtons = document.querySelectorAll('.deleteLessonButton');
                deleteButtons.forEach(button => {
                   button.addEventListener('click', (e) => {
                       e.preventDefault();
                        const lessonId = e.target.parentElement.getAttribute('data-id');
                     if (confirm('Вы уверены, что хотите удалить тему урока с ID: ' + lessonId + '?')) {
                            fetch('api/lesson.php?action=deleteLesson&id='+lessonId , {
                                  method: 'DELETE',
                                }).then(response => response.json())
                             .then(data => {
                                    if (data.success) {
                                       const subjectSelect = document.getElementById('subjectSelect').value;
                                         fetchLessonData(subjectSelect);
                                   } else {
                                       alert(data.message || 'Ошибка при удалении темы урока.');
                                   }
                           })
                            .catch(error => {
                                 console.error('Fetch Error:', error);
                                    alert('Ошибка сети при удалении темы урока.');
                            });
                      }
                  });
              });
         }
         fetchLessons();
       }
         //Lesson modals
       let addLessonButton = document.getElementById('addLessonButton');
        let addLessonModal = document.getElementById('addLessonModal');
       let addLessonClose = document.getElementById('addLessonClose');
        if(addLessonButton){
            addLessonButton.addEventListener('click', () => {
                addLessonModal.style.display = 'block';
             });
           addLessonClose.addEventListener('click', () => {
               addLessonModal.style.display = 'none';
           });
            window.addEventListener('click', (event) => {
              if (event.target === addLessonModal) {
                    addLessonModal.style.display = 'none';
                }
            });
        }
        let editLessonModal = document.getElementById('editLessonModal');
         let editLessonClose = document.getElementById('editLessonClose');
         if(editLessonModal){
             editLessonClose.addEventListener('click', () => {
               editLessonModal.style.display = 'none';
          });
          window.addEventListener('click', (event) => {
            if (event.target === editLessonModal) {
                editLessonModal.style.display = 'none';
             }
         });
       }
         function openEditLessonModal(id, theme) {
           document.getElementById('editLessonId').value = id;
           document.getElementById('editLessonTheme').value = theme;
           document.getElementById('editLessonModal').style.display = 'block';
       }
      window.openEditLessonModal = openEditLessonModal;
        let addLessonForm = document.getElementById('addLessonForm');
        if (addLessonForm) {
            addLessonForm.addEventListener('submit', function(event) {
                event.preventDefault();
                 const formData = new FormData(this);
                fetch('api/lesson.php', {
                   method: 'POST',
                  body: formData,
                 }).then(response => response.json())
                 .then(data => {
                     if (data.success) {
                        const subjectSelect = document.getElementById('subjectSelect').value;
                           fetchLessonData(subjectSelect);
                         document.getElementById('addLessonModal').style.display = "none";
                      } else {
                        alert(data.message || 'Ошибка при добавлении темы урока.');
                     }
                })
                 .catch(error => {
                     console.error('Ошибка:', error);
                      alert('Ошибка сети при добавлении темы урока.');
                  });
            });
       }
        let editLessonForm = document.getElementById('editLessonForm');
        if(editLessonForm){
           editLessonForm.addEventListener('submit', function(event) {
               event.preventDefault();
               const formData = new FormData(this);
                fetch('api/lesson.php', {
                    method: 'POST',
                    body: formData,
                 }).then(response => response.json())
                 .then(data => {
                       if (data.success) {
                           const subjectSelect = document.getElementById('subjectSelect').value;
                          fetchLessonData(subjectSelect);
                            document.getElementById('editLessonModal').style.display = "none";
                       } else {
                            alert(data.message || 'Ошибка при редактировании темы урока.');
                        }
                 })
                   .catch(error => {
                      console.error('Ошибка:', error);
                        alert('Ошибка сети при редактировании темы урока.');
                    });
             });
        }
        // --- Student Management (student) ---
         if(document.getElementById("scheduleTableBody")){
              function fetchStudentSchedule(){
                fetch('api/schedule.php?action=getStudentSchedule')
                   .then(response => response.json())
                   .then(data => {
                      const tableBody = document.getElementById('scheduleTableBody');
                      if(tableBody && data && data.schedule){
                         tableBody.innerHTML = '';
                            data.schedule.forEach(schedule => {
                              const row = document.createElement('tr');
                                row.innerHTML = `
                                   <td>${schedule.subject}</td>
                                    <td>${schedule.time}</td>
                                  <td>${schedule.teacher}</td>
                                 `;
                              tableBody.appendChild(row);
                           });
                      }
                 })
                 .catch(error => console.error('Fetch Error:', error));
            }
           fetchStudentSchedule();
         }
         if(document.getElementById('marksTableBody')){
           function fetchStudentMarks(){
                fetch('api/marks.php?action=getStudentMarks')
                  .then(response => response.json())
                   .then(data => {
                       const tableBody = document.getElementById('marksTableBody');
                      if(tableBody && data && data.marks){
                          tableBody.innerHTML = '';
                           data.marks.forEach(mark => {
                                const row = document.createElement('tr');
                                  row.innerHTML = `
                                    <td>${mark.subject}</td>
                                     <td>${mark.mark}</td>
                                  `;
                               tableBody.appendChild(row);
                            });
                        }
                   })
                 .catch(error => console.error('Fetch Error:', error));
             }
           fetchStudentMarks();
       }
    }

    function checkAuth() {
        fetch('api/auth.php?action=checkAuth')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    currentUser = data.user;
                      loadDashboard();
                } else {
                    loadContent('auth.html');
                }
            })
           .catch(error => {
                console.error('Ошибка авторизации:', error);
                  loadContent('auth.html');
           });
    }

    function loadDashboard() {
         if (currentUser) {
             switch (currentUser.role) {
                 case 'admin':
                    loadContent('admin/index.html');
                     break;
                case 'teacher':
                   loadContent('teacher/index.html');
                    break;
                 case 'deputy':
                  loadContent('deputy/index.html');
                     break;
                case 'student':
                   loadContent('student/index.html');
                    break;
               default:
                  loadContent('auth.html');
                     break;
            }
         }else {
             loadContent('auth.html');
          }
    }

   // Handle Login Submission
    appDiv.addEventListener('submit', function(event) {
        if (event.target.id === 'loginForm') {
            event.preventDefault();
             const loginForm = event.target;
             const formData = new FormData(loginForm);
             fetch('api/auth.php', {
                 method: 'POST',
                 body: formData,
             })
               .then(response => response.json())
               .then(data => {
                   if (data.success) {
                       currentUser = data.user;
                        loadDashboard();
                     }else {
                         alert('Неверный логин или пароль.');
                     }
               })
               .catch(error => {
                   console.error('Ошибка входа:', error);
                   alert('Ошибка при входе.');
                 });
           }
     });
      // Handle Logout
       appDiv.addEventListener('click', function(event) {
        if (event.target.id === 'logoutButton') {
            event.preventDefault();
             fetch('api/auth.php?action=logout')
               .then(response => response.json())
               .then(data => {
                    if (data.success) {
                        currentUser = null;
                         loadContent('auth.html');
                    } else {
                         alert('Ошибка при выходе.');
                    }
              })
                .catch(error => {
                     console.error('Ошибка выхода:', error);
                    alert('Ошибка при выходе.');
                 });
           }
      });


    // Initial auth check and content load
    checkAuth();

});