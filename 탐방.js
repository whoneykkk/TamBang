function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const day = dayNames[now.getDay()];

        document.getElementById("year").textContent = `${year}년`;
        document.getElementById("date").textContent = `${month}월 ${date}일`;
        document.getElementById("day").textContent = `(${day})`;
      }

      updateTime();
setInterval(updateTime, 1000 * 60 * 60);
      
document.addEventListener("DOMContentLoaded", () => {
    const iconButtons = document.querySelectorAll(".icon-button");
    const sections = document.querySelectorAll(".content-section");
    const asides = document.querySelectorAll(".content-aside");

    if (iconButtons.length > 0) {
        iconButtons[0].classList.add("active");
        sections[0].classList.add("active-section");
        asides[0].classList.add("active-aside");
    }

    iconButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            sections.forEach(section => section.classList.remove("active-section"));
            asides.forEach(aside => aside.classList.remove("active-aside"));
            iconButtons.forEach(btn => btn.classList.remove("active"));

            sections[index].classList.add("active-section");
            asides[index].classList.add("active-aside");
            button.classList.add("active");
        });
    });

    const savedQuests = JSON.parse(localStorage.getItem("questList")) || [];
    const questList = document.getElementById("questList");

    savedQuests.forEach((quest) => {
        addQuest(quest);
    });
});

function saveTable(questName) {
    const scheduleTable = document.getElementById("schedule_table");
    const accTable = document.getElementById("accountBook_table");
    const uncheckTable = document.getElementById("uncheck_table");
    const checkTable = document.getElementById("check_table");

    const scheduleData = Array.from(scheduleTable.querySelectorAll("article")).map(article => {
        return Array.from(article.querySelectorAll("tr")).map(row => {
            return Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim());
        });
    });

    const accData = Array.from(accTable.querySelectorAll("article")).map(article => {
        return Array.from(article.querySelectorAll("tr")).map(row => {
            return Array.from(row.querySelectorAll("td")).slice(1).map(cell => cell.textContent.trim());
        });
    });

    const uncheckData = Array.from(uncheckTable.querySelectorAll("tr")).slice(1).map(row => {
        return Array.from(row.querySelectorAll("td")).slice(1).map(cell => cell.textContent.trim());
    });

    const checkData = Array.from(checkTable.querySelectorAll("tr")).slice(1).map(row => {
        return Array.from(row.querySelectorAll("td")).slice(1).map(cell => cell.textContent.trim());
    });

    localStorage.setItem(`schedule_${questName}`, JSON.stringify(scheduleData));
    localStorage.setItem(`accBook_${questName}`, JSON.stringify(accData));
    localStorage.setItem(`uncheck_${questName}`, JSON.stringify(uncheckData));
    localStorage.setItem(`check_${questName}`, JSON.stringify(checkData));
}

function loadTable(questName) {
    const scheduleData = JSON.parse(localStorage.getItem(`schedule_${questName}`)) || [];
    const accData = JSON.parse(localStorage.getItem(`accBook_${questName}`)) || [];
    const uncheckData = JSON.parse(localStorage.getItem(`uncheck_${questName}`)) || [];
    const checkData = JSON.parse(localStorage.getItem(`check_${questName}`)) || [];
    
    const scheduleTable = document.getElementById("schedule_table");
    const accTable = document.getElementById("accountBook_table");
    const uncheckTable = document.getElementById("uncheck_table");
    const checkTable = document.getElementById("check_table");

    scheduleTable.innerHTML = '';
    accTable.innerHTML = '';
    uncheckTable.innerHTML = '';
    checkTable.innerHTML = '';

    if (scheduleData.length > 0) {
        scheduleData.forEach((dayData, index) => {
            const article = document.createElement("article");
            const table = document.createElement("table");

            const titleRow = document.createElement("tr");
            const titleCell = document.createElement("th");
            titleCell.colSpan = 3;
            titleCell.textContent = `${index + 1}일차`;
            titleRow.appendChild(titleCell);
            table.appendChild(titleRow);

            dayData.forEach(rowData => {
                const row = document.createElement("tr");
                rowData.forEach(cellData => {
                    const cell = document.createElement("td");
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
                table.appendChild(row);
            });

            article.appendChild(table);
            scheduleTable.appendChild(article);
        });
    }

    if (accData.length > 0) {
        accData.forEach((dayData, index) => {
            const article = document.createElement("article");
            const table = document.createElement("table");

            const titleRow = document.createElement("tr");
            const titleCell = document.createElement("th");
            titleCell.colSpan = 4;
            titleCell.textContent = `${index + 1}일차`;
            titleRow.appendChild(titleCell);
            table.appendChild(titleRow);

            dayData.forEach(rowData => {
                if (rowData.length === 0) return;

                const row = document.createElement("tr");

                const checkCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkCell.appendChild(checkbox);
                row.appendChild(checkCell);

                rowData.forEach(cellData => {
                    const cell = document.createElement("td");
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
                table.appendChild(row);
            });

            article.appendChild(table);
            accTable.appendChild(article);
        });
        
    }

    const uncheckHeader = document.createElement("thead");
    const uncheckHeaderRow = document.createElement("tr");
    const uncheckTitleCell = document.createElement("th");
    uncheckTitleCell.colSpan = 3;
    uncheckTitleCell.textContent = "준비 필요";
    uncheckHeaderRow.appendChild(uncheckTitleCell);
    uncheckHeader.appendChild(uncheckHeaderRow);
    uncheckTable.appendChild(uncheckHeader);

    // 체크 테이블 헤더 추가
    const checkHeader = document.createElement("thead");
    const checkHeaderRow = document.createElement("tr");
    const checkTitleCell = document.createElement("th");
    checkTitleCell.colSpan = 3;
    checkTitleCell.textContent = "준비 완료";
    checkHeaderRow.appendChild(checkTitleCell);
    checkHeader.appendChild(checkHeaderRow);
    checkTable.appendChild(checkHeader);

    // 언체크 테이블 데이터 로드
    if (uncheckData.length > 0) {
        uncheckData.forEach(rowData => {
            const row = document.createElement("tr");

            const checkCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", () => handleCheckboxChange(checkbox, row));
            checkCell.appendChild(checkbox);
            row.appendChild(checkCell);

            rowData.forEach(cellData => {
                const cell = document.createElement("td");
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            uncheckTable.appendChild(row);
        });
    }

    // 체크 테이블 데이터 로드 (체크박스가 모두 선택된 상태)
    if (checkData.length > 0) {
        checkData.forEach(rowData => {
            const row = document.createElement("tr");

            const checkCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = true; // 체크박스를 선택된 상태로 설정
            checkbox.addEventListener("change", () => handleCheckboxChange(checkbox, row));
            checkCell.appendChild(checkbox);
            row.appendChild(checkCell);

            rowData.forEach(cellData => {
                const cell = document.createElement("td");
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            checkTable.appendChild(row);
        });
    }

    makeCellsEditable(scheduleTable);
    makeCellsEditable(uncheckTable);
    makeCellsEditable(checkTable);
    makeCellsEditable(accTable);

    updateSelectOptions("selectPlace", scheduleData.length);
    updateSelectOptions("selectAccSchedule", scheduleData.length);

    console.log(`Table for ${questName} loaded from local storage.`);
}

function saveQuest(questName) {
    const savedQuests = JSON.parse(localStorage.getItem("questList")) || [];
    if (!savedQuests.includes(questName)) {
        savedQuests.push(questName);
        localStorage.setItem("questList", JSON.stringify(savedQuests));
    }
}

function updateSelectOptions(elementId, length) {
    const selectElement = document.getElementById(elementId);
    selectElement.innerHTML = ''; // 기존 옵션 제거
    for (let i = 1; i <= length; i++) {
        const option = document.createElement("option");
        option.textContent = `${i}일차`;
        option.value = i;
        selectElement.appendChild(option);
    }
}

function addQuest(questName) {
    const questList = document.getElementById("questList");

    const newListItem = document.createElement("li");
    newListItem.textContent = questName;

    // When quest is clicked, update header, load schedule, and underline selected item
    newListItem.addEventListener("click", () => {
        document.getElementById("tambang").textContent = questName;

        // Save current schedule data before switching quests
        const currentSelected = document.querySelector("#questList .selected");
        if (currentSelected) {
            currentSelected.classList.remove("selected");
        }

        // Load new schedule data for selected quest
        loadTable(questName);
        newListItem.classList.add("selected");
    });

    questList.appendChild(newListItem);
}

function delQuest(questName) {
    const savedQuests = JSON.parse(localStorage.getItem("questList")) || [];
    const updatedQuests = savedQuests.filter((quest) => quest !== questName);

    // questName이 목록에 존재하는지 확인
    const found = savedQuests.length !== updatedQuests.length;

    // 2. questList 업데이트
    localStorage.setItem("questList", JSON.stringify(updatedQuests));

    // 3. questList UI에서 questName 항목 삭제
    const questList = document.getElementById("questList");
    const questItems = questList.querySelectorAll("li");
    questItems.forEach((item) => {
        if (item.textContent === questName) {
            questList.removeChild(item);
        }
    });

    // 4. 스케줄 삭제
    if (found) {
        localStorage.removeItem(`schedule_${questName}`);
        localStorage.removeItem(`accBook_${questName}`);
        localStorage.removeItem(`uncheck_${questName}`);
        localStorage.removeItem(`check_${questName}`);
        console.log(`Schedule for ${questName} removed from local storage.`);
    }

    return found; // 삭제 여부 반환
}

document.getElementById("btnSave").addEventListener("click", () => {
    const currentSelected = document.querySelector("#questList .selected");
    saveTable(currentSelected.textContent);
});

document.getElementById("btnQuest").addEventListener("click", () => {
    const inputField = document.getElementById("inputQuest");
    let inputValue = inputField.value.trim();

    if (inputValue) {
        // 중복된 이름이 있는지 확인
        const savedQuests = JSON.parse(localStorage.getItem("questList")) || [];
        let newName = inputValue;
        let count = 1;
        
        while (savedQuests.includes(newName)) {
            newName = `${inputValue} (${count+1})`;
            count++;
        }

        addQuest(newName);  // 중복이 해결된 이름으로 추가
        saveQuest(newName);
        inputField.value = "";
    } else {
        alert("추가할 탐사지 이름을 입력하세요.");
    }
});

document.getElementById("btnDelQuest").addEventListener("click", () => {
    const inputField = document.getElementById("inputDelQuest");
    const inputValue = inputField.value.trim();

    if (inputValue) {
        if (!delQuest(inputValue)) {
            alert("해당 여행지 항목을 찾을 수 없습니다.");
        }
        inputField.value = "";
    } else {
        alert("삭제할 항목을 입력해 주세요.");
    }
});

document.getElementById("btnDate").addEventListener("click", () => {
    const startDate = document.getElementById("inputStartDate").value;
    const endDate = document.getElementById("inputEndDate").value;

    if (!startDate || !endDate) {
        alert("출발일과 복귀일을 모두 입력하세요.");
        return;
    }

    const startD = new Date(startDate);
    const endD = new Date(endDate);

    const period = Math.floor((endD - startD) / (1000 * 60 * 60 * 24)) + 1;

    if (period < 1) {
        alert("복귀일은 출발일 이후여야 합니다.");
        return;
    }

    const scheduleTable = document.getElementById("schedule_table");
    const scheduleArticles = scheduleTable.querySelectorAll("article");

    const accBookTable = document.getElementById("accountBook_table");
    const accBookArticles = accBookTable.querySelectorAll("article");

    const uncheckTable = document.getElementById("uncheck_table");
    const checkTable = document.getElementById("check_table");

    // 준비 필요 테이블 헤더 추가
    if (!uncheckTable.querySelector("thead")) {
        const uncheckHeader = document.createElement("thead");
        const uncheckHeaderRow = document.createElement("tr");
        const uncheckTitleCell = document.createElement("th");
        uncheckTitleCell.colSpan = 3;
        uncheckTitleCell.textContent = "준비";
        uncheckHeaderRow.appendChild(uncheckTitleCell);
        uncheckHeader.appendChild(uncheckHeaderRow);
        uncheckTable.appendChild(uncheckHeader);
    }

    // 준비 완료 테이블 헤더 추가
    if (!checkTable.querySelector("thead")) {
        const checkHeader = document.createElement("thead");
        const checkHeaderRow = document.createElement("tr");
        const checkTitleCell = document.createElement("th");
        checkTitleCell.colSpan = 3;
        checkTitleCell.textContent = "준비 완료";
        checkHeaderRow.appendChild(checkTitleCell);
        checkHeader.appendChild(checkHeaderRow);
        checkTable.appendChild(checkHeader);
    }

    if (scheduleArticles.length < period) {
        for (let i = scheduleArticles.length + 1; i <= period; i++) {
            const article = document.createElement("article");

            const table = document.createElement("table");

            const titleRow = document.createElement("tr");
            const titleCell = document.createElement("th");
            titleCell.colSpan = 3;
            titleCell.textContent = `${i}일차`;
            titleRow.appendChild(titleCell);
            table.appendChild(titleRow);

            const headerRow = document.createElement("tr");
            ["장소", "시간", "메모"].forEach((text) => {
                const th = document.createElement("td");
                th.textContent = text;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            const tbody = document.createElement("tbody");
            table.appendChild(tbody);

            article.appendChild(table);
            scheduleTable.appendChild(article);
        }

        for (let i = accBookArticles.length + 1; i <= period; i++) {
            const article = document.createElement("article");
            const table = document.createElement("table");

            const titleRow = document.createElement("tr");
            const titleCell = document.createElement("th");
            titleCell.colSpan = 4;
            titleCell.textContent = `${i}일차`;
            titleRow.appendChild(titleCell);
            table.appendChild(titleRow);

            // 헤더 행 생성 및 체크박스 추가
            const headerRow = document.createElement("tr");

            // 나머지 헤더 셀 추가
            ["", "항목", "가격", "태그"].forEach((text) => {
                const th = document.createElement("td");
                th.textContent = text;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            const tbody = document.createElement("tbody");
            table.appendChild(tbody);

            article.appendChild(table);
            accBookTable.appendChild(article);
        }
        
    } else if (scheduleArticles.length > period) {
        // 기존 일차보다 적어지면 초과하는 일차 삭제
        for (let i = scheduleArticles.length; i > period; i--) {
            scheduleTable.removeChild(scheduleArticles[i - 1]);
            accBookTable.removeChild(accBookArticles[i - 1]);
        }
    }    

    updateSelectOptions("selectPlace", period);
    updateSelectOptions("selectAccSchedule", period);

    document.getElementById("inputStartDate").value = "";
    document.getElementById("inputEndDate").value = "";
});

document.getElementById("btnSchedule").addEventListener("click", () => {
    const selectedDay = document.getElementById("selectPlace").value;
    const place = document.getElementById("inputPlace").value;
    const time = document.getElementById("inputTime").value;

    // Find the corresponding article for the selected day
    const articles = document.querySelectorAll("#schedule_table article");
    const article = articles[selectedDay - 1];
    
    // Ensure that the article and tbody exist
    if (!article) {
        console.error("Error: No article found for the selected day.");
        return;
    }

    let tbody = article.querySelector("tbody");
    
    // If tbody is missing, create it
    if (!tbody) {
        tbody = document.createElement("tbody");
        article.querySelector("table").appendChild(tbody);
    }

    // Create a new row for the schedule entry
    const newRow = document.createElement("tr");

    const placeCell = document.createElement("td");
    placeCell.textContent = place;
    newRow.appendChild(placeCell);

    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    newRow.appendChild(timeCell);

    const memoCell = document.createElement("td");
    memoCell.textContent = "클릭해서 수정"; // 메모 셀을 빈 상태로 추가
    memoCell.classList.add("memo-cell");
    newRow.appendChild(memoCell);

    // Append the new row to tbody
    tbody.appendChild(newRow);

    makeCellsEditable(tbody);
    
    // Clear the input fields
    document.getElementById("inputPlace").value = "";
    document.getElementById("inputTime").value = "";
});

document.getElementById("btnDelSche").addEventListener("click", () => {
    const inputField = document.getElementById("inputDelSchedule");
    const inputValue = inputField.value.trim();

    if (inputValue) {
        const scheduleTable = document.getElementById("schedule_table");
        let found = false;

        Array.from(scheduleTable.querySelectorAll("article")).forEach(article => {
            const rows = article.querySelectorAll("tr");

            rows.forEach(row => {
                const placeCell = row.cells[0]; // Assuming the place "장소" is in the first cell

                if (placeCell && placeCell.textContent === inputValue) {
                    row.parentNode.removeChild(row); // Remove the row from the table
                    found = true;
                }
            });
        });

        if (!found) {
            alert("해당 일정 항목을 찾을 수 없습니다.");
        }

        inputField.value = "";
    } else {
        alert("삭제할 일정 항목을 입력해 주세요.");
    }
});

const tagTotals = {
    "식비": 0,
    "교통비": 0,
    "숙박비": 0,
    "기타": 0
};

document.getElementById("btnAddAcc").addEventListener("click", () => {
    const selectedDay = document.getElementById("selectAccSchedule").value;
    const accItem = document.getElementById("inputAccItem").value;
    const accAmount = parseInt(document.getElementById("inputAccAmount").value);
    const accTag = document.getElementById("selectAccTag").value;

    if (!selectedDay || !accItem || isNaN(accAmount)) {
        alert("일정, 항목, 금액을 모두 입력해 주세요.");
        return;
    }

    const accTable = document.getElementById("accountBook_table");
    const article = accTable.querySelectorAll("article")[selectedDay - 1];
    const table = article.querySelector("table");

    const row = document.createElement("tr");

    // 체크박스 셀 추가
    const checkCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkCell.appendChild(checkbox);
    row.appendChild(checkCell);

    // 항목, 가격, 태그 셀 추가
    const itemCell = document.createElement("td");
    itemCell.textContent = accItem;
    row.appendChild(itemCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = `${accAmount}원`;
    row.appendChild(amountCell);

    const tagCell = document.createElement("td");
    tagCell.textContent = accTag;
    row.appendChild(tagCell);

    table.appendChild(row);

    makeCellsEditable(accTable);

    // Clear input fields
    document.getElementById("inputAccItem").value = "";
    document.getElementById("inputAccAmount").value = "";

    // 태그 합산 업데이트
    tagTotal();
});

document.getElementById("selectTag").addEventListener("change", tagTotal);

function tagTotal() {
    const selectedTag = document.getElementById("selectTag").value;
    let totalAmount = 0;

    // accTable의 모든 article을 순회하면서 태그 합산
    document.querySelectorAll("#accountBook_table article").forEach(article => {
        article.querySelectorAll("tr").forEach(row => {
            const tagCell = row.cells[3]; // 태그 셀 위치
            const priceCell = row.cells[2]; // 가격 셀 위치
            const tag = tagCell ? tagCell.textContent : '';
            const amount = priceCell ? parseInt(priceCell.textContent.replace(/[^\d]/g, "")) : 0;

            if ((selectedTag === "전체" || tag === selectedTag) && !isNaN(amount)) {
                totalAmount += amount;
            }
        });
    });

    document.getElementById("total").textContent = `총 ${totalAmount}원`;
}

document.getElementById("btnDelAcc").addEventListener("click", () => {
    const inputField = document.getElementById("inputDelAcc");
    const inputValue = inputField.value.trim();

    if (inputValue) {
        const accountBookTable = document.getElementById("accountBook_table");
        let found = false;

        // Search through each article (day) in the account book table
        Array.from(accountBookTable.querySelectorAll("article")).forEach(article => {
            const rows = article.querySelectorAll("tr");

            rows.forEach(row => {
                const itemCell = row.cells[1]; // Assuming the item "항목" is in the second cell
                const amountCell = row.cells[2]; // Assuming the amount is in the third cell
                const tagCell = row.cells[3]; // Assuming the tag is in the fourth cell

                if (itemCell && itemCell.textContent === inputValue) {
                    // Parse the amount from the cell, removing any non-numeric characters
                    const amount = parseInt(amountCell.textContent.replace(/[^\d]/g, ""));
                    const tag = tagCell.textContent;

                    // Subtract the amount from the corresponding tag total
                    if (tagTotals[tag] !== undefined && !isNaN(amount)) {
                        tagTotals[tag] -= amount;
                    }

                    // Remove the row from the table
                    row.parentNode.removeChild(row);
                    found = true;
                }
            });
        });

        if (!found) {
            alert("해당 항목을 찾을 수 없습니다.");
        } else {
            // Update the displayed total based on the selected tag in the dropdown
            tagTotal();
        }

        inputField.value = ""; // Clear the input field
    } else {
        alert("삭제할 항목을 입력해 주세요.");
    }
});

document.getElementById("inputNum").addEventListener("input", calDutch);
document.getElementById("btnSum").addEventListener("click", calDutch);

function calDutch() {
    const numPeople = parseInt(document.getElementById("inputNum").value);
    let totalAmount = 0;
    
    const checkedItems = document.querySelectorAll("#accountBook_table input[type='checkbox']:checked");

    checkedItems.forEach(checkbox => {
        const row = checkbox.closest("tr");
        const amountCell = row.cells[2]; // Assuming the amount is in the third cell
        const amount = parseInt(amountCell.textContent.replace(/[^\d]/g, ""));
        
        if (!isNaN(amount)) {
            totalAmount += amount;
        }
    });

    if (isNaN(numPeople) || numPeople <= 0) {
        document.getElementById("dutch").textContent = "인당 원";
        return;
    }

    document.getElementById("chkSum").textContent = `총 ${totalAmount}원`;
    const perPersonAmount = Math.floor(totalAmount / numPeople);
    document.getElementById("dutch").textContent = `인당 ${perPersonAmount}원`;
}

function handleCheckboxChange(checkbox, newRow) {
    const targetTable = checkbox.checked ? document.getElementById("check_table") : document.getElementById("uncheck_table");
    targetTable.appendChild(newRow);
}

document.getElementById("btnAddChk").addEventListener("click", () => {
    const inputField = document.getElementById("inputAddChk");
    const inputValue = inputField.value.trim();

    if (inputValue) {
        const uncheckTable = document.getElementById("uncheck_table");

        const newRow = document.createElement("tr");

        const itemCell = document.createElement("td");
        itemCell.textContent = inputValue;

        itemCell.addEventListener("click", () => makeCellsEditable(itemCell));

        const checkCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        checkbox.addEventListener("change", () => handleCheckboxChange(checkbox, newRow));

        checkCell.appendChild(checkbox);
        newRow.appendChild(checkCell);
        newRow.appendChild(itemCell);
        

        const emptyCell = document.createElement("td"); // 빈 셀 생성
        emptyCell.textContent = "클릭해서 수정"; // 내용 없음
        emptyCell.classList.add("memo-cell");


        emptyCell.addEventListener("click", () => makeCellsEditable(emptyCell));

        newRow.appendChild(emptyCell);
        uncheckTable.appendChild(newRow);
        inputField.value = "";

        
        makeCellsEditable(uncheckTable);
    } else {
        alert("추가할 항목을 입력해 주세요.");
    }
});

document.getElementById("btnDelChk").addEventListener("click", () => {
    const inputField = document.getElementById("inputDelChk");
    const inputValue = inputField.value.trim();

    if (inputValue) {
        const uncheckTable = document.getElementById("uncheck_table");
        const checkTable = document.getElementById("check_table");
        let found = false;

        Array.from(uncheckTable.querySelectorAll("tr")).forEach(row => {
            const itemCell = row.cells[1];
            if (itemCell && itemCell.textContent === inputValue) {
                uncheckTable.removeChild(row);
                found = true;
            }
        });

        Array.from(checkTable.querySelectorAll("tr")).forEach(row => {
            const itemCell = row.cells[1];
            if (itemCell && itemCell.textContent === inputValue) {
                checkTable.removeChild(row);
                found = true;
            }
        });

        if (!found) {
            alert("해당 항목을 찾을 수 없습니다.");
        }

        inputField.value = "";
    } else {
        alert("삭제할 항목을 입력해 주세요.");
    }
});

function makeCellsEditable(table) {
    const isScheduleTable = table.id === "schedule_table";
    const rows = table.querySelectorAll("tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, index) => {
            // 체크박스가 있는 셀은 건너뜀
            if (!isScheduleTable && index === 0) return;

            cell.addEventListener("click", () => {
                const originalText = cell.textContent;
                const input = document.createElement("input");
                input.type = "text";
                input.value = originalText;
                
                // 수정 후 내용 저장
                input.addEventListener("blur", () => {
                    cell.textContent = input.value.trim() || originalText; // 빈 값일 경우 원래 값으로 되돌림
                    cell.classList.remove("memo-cell");
                });

                // Enter 키를 눌러서 수정 완료
                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        cell.textContent = input.value.trim() || originalText; // 빈 값일 경우 원래 값으로 되돌림
                    }
                });

                cell.innerHTML = ""; // 기존 내용을 지우고 입력 필드 추가
                cell.appendChild(input);
                input.focus(); // 입력 필드에 포커스

                cell.classList.add("memo-cell");
            });
        });
    });
}
