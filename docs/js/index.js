let hand = []
let deck = []
let collection = []

class Card {
    constructor(name, desc, category, color, symbol, number) {
        this.name = name
        this.description = desc
        this.category = category
        this.color = color
        this.number = number
        this.symbol = symbol
    }
}


let cardContextMenu = document.getElementById("cardContextMenu")
let selectedCardContextMenu;
let cmDelete = document.getElementById("cmDelete")

let cardsDisplay = document.getElementById("cardsDisplay")

let creationForm = document.getElementById("creationForm")
let creationModal = document.getElementById("creationModal")
let creationModalBtn = document.getElementById("creationModalBtn")
let creationButton = document.getElementById("creationButton")

let settingsModal = document.getElementById("settingsModal")
let settingsModalBtn = document.getElementById("settingsBtn")
let settingsBgColor = document.getElementById("bgColorIn")

let collectionCards = document.getElementById("collectionCards")
let deckCards = document.getElementById("deckCards")
let handCards = document.getElementById("handCards")

let draggable;
let draggingCat;
let draggingInd;
let clone = null;
let dragging; 

let mouseX;
let mouseY;

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function loadBgColor() {
    let newColor = localStorage.getItem("bgColor");
    if (!newColor) {
        console.log("No color detected.");
        newColor = "#388535";
        localStorage.setItem("bgColor", newColor);
    }
    document.body.style.backgroundColor = newColor;
    settingsBgColor.value = newColor;
}

function newBgColor(newColor) {
    localStorage.setItem("bgColor", newColor);
    loadBgColor();
}

loadCards()
loadBgColor()

function loadCards() {
    let cardSave = localStorage.getItem("cardSave");

    if (cardSave) {
        let parsedSave = JSON.parse(cardSave)
        hand = parsedSave.hand
        deck = parsedSave.deck
        collection = parsedSave.collection
        displayCards()
    }
    else {
        console.log("No save detected.");
    }
}

function saveCards() {
    let cardSave = {hand, deck, collection}
    // console.log(cardSave);
    localStorage.setItem("cardSave", JSON.stringify(cardSave))
}

function generateCardHTML(card, index) {
    let symbolFormat;

    if (card.symbol.includes('fa-')) {
        symbolFormat = `<i class="${card.symbol}"></i>`
    } else {
        symbolFormat = `<h1>${card.symbol}</h1>`
    }

    let formattedDescription = card.description.replace(/\n/g, '<br>');

    return `
    <div class="card draggable" style="color: ${card.color}" draggable="true" card-id="${index}" card-category="${card.category}">
    <p class="name"><b>${card.name}</b></p>
    <p class="desc">${formattedDescription}</p>

    <div class="cardMarking cmTL">
    <h2>${card.number}</h2>
    ${symbolFormat}
    </div>

    <div class="cardMarking cmBR">
    <h2>${card.number}</h2>
    ${symbolFormat}
    </div>

    </div>
    `;
}

Array.prototype.insertBeforeItem = function (itemToInsertBefore, newItem) {
    const index = this.indexOf(itemToInsertBefore);
    if (index !== -1) {
        this.splice(index, 0, newItem);
    }
};

Array.prototype.insertAfterItem = function (itemToInsertAfter, newItem) {
    const index = this.indexOf(itemToInsertAfter);
    if (index !== -1) {
        this.splice(index + 1, 0, newItem);
    }
};

Array.prototype.deleteItem = function (itemToDelete) {
    const index = this.indexOf(itemToDelete);
    if (index !== -1) {
        this.splice(index, 1);
    }
};

function displayCards() {
    let displayCollection = ``
    let displayDeck = ``
    let displayHand = ``

    collection.forEach((card, index) => {
        console.log(card);
        displayCollection += generateCardHTML(card, index);
    });

    collectionCards.innerHTML = displayCollection

    deck.forEach((card, index) => {
        console.log(card);
        displayDeck += generateCardHTML(card, index);
    });

    deckCards.innerHTML = displayDeck

    hand.forEach((card, index) => {
        console.log(card);
        displayHand += generateCardHTML(card, index);
    });

    handCards.innerHTML = displayHand
    let containers = document.querySelectorAll('.container')



    
    applyEventListeners()
    setEventListeners(containers)
}

function applyEventListeners() {

    let draggables = document.querySelectorAll('.draggable')

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', event => {
            draggable.classList.add('dragging')
            dragging = draggable

            var invisibleImg = document.createElement('img');
            invisibleImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // A tiny transparent GIF
            document.body.appendChild(invisibleImg); // Append it to the body temporarily        
            event.dataTransfer.setDragImage(invisibleImg, 0, 0);


            if (dragging) {
                clone = dragging.cloneNode(true); // Clone the target element
                clone.className = 'card dragging-clone'; // Reset class list to only 'dragging-clone'
                clone.style.position = 'absolute';
                clone.style.opacity = '1';
                // Initially, don't append the clone to the document to avoid flickering
            }
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })

        cardsDisplay.addEventListener('dragover', event => {
            if (clone) {
                // Position the clone at the touch location
                clone.style.left = `${event.clientX + window.scrollX - clone.offsetWidth / 2}px`;
                clone.style.top = `${event.clientY + window.scrollY - clone.offsetHeight / 2}px`;
                // Append the clone to the body if it hasn't been already
                if (!clone.parentNode) {
                    cardsDisplay.appendChild(clone);
                }
            }
        })

        draggable.addEventListener('touchstart', event => {
            draggable.classList.add('dragging')
            dragging = draggable
        })

        draggable.addEventListener('touchend', () => {
            draggable.classList.remove('dragging')
        })
        
        draggable.addEventListener('click', () => {
            // Clone card content and append to modal
            zoomModal.innerHTML = ''; // Clear modal content
            const content = draggable.cloneNode(true);
            content.classList.add('zoomModal-content');
            zoomModal.appendChild(content);
            content.innerHTML += `<p id="indexNum">${Number(draggable.getAttribute("card-id"))+1}</p>`
    
            // Show modal
            zoomModal.style.display = 'grid';
        });

        
        draggable.addEventListener('contextmenu', event => {
            event.preventDefault();
            let x = event.clientX + window.scrollX;
            let y = event.clientY + window.scrollY;

            winWidth = window.innerWidth,
            pageHeight = document.documentElement.scrollHeight;
            cmWidth = cardContextMenu.offsetWidth,
            cmHeight = cardContextMenu.offsetHeight;

            x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
            y = y > pageHeight - cmHeight ? pageHeight - cmHeight - 5 : y;

            cardContextMenu.style.left = `${x}px`;
            cardContextMenu.style.top = `${y}px`;
            cardContextMenu.style.visibility = "visible";

            selectedCardContextMenu = findAncestorWithClass(event.target, "card")
        })

    })

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

}

function setEventListeners(containers) {
    containers.forEach(container => {
        let elements;
        let closestElement;
        let closestDistance;

        // PC Drag and Drop

        container.addEventListener('dragover', event => {

            // Select all elements you want to track
            event.preventDefault()
            elements = document.querySelectorAll('.draggable:not(.dragging)');
            overCat = container

            mouseX = event.clientX
            mouseY = event.clientY
            

            let closestLeftElement = null;
            let closestRightElement = null;
            let closestLeftDistance = Number.MAX_SAFE_INTEGER;
            let closestRightDistance = Number.MAX_SAFE_INTEGER;
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - elementX);

                // console.log(overCat, dragging.parentElement.id);

                // Update closest element on the left side
                if (mouseX > elementX && distance < closestLeftDistance && mouseY >= rect.top && mouseY <= rect.bottom && element.parentElement.id === overCat.id) {
                    closestLeftElement = element;
                    closestLeftDistance = distance;
                }
                
                if (mouseX < elementX && distance < closestRightDistance && mouseY >= rect.top && mouseY <= rect.bottom && element.parentElement.id === overCat.id) {
                    closestRightElement = element;
                    closestRightDistance = distance;
                }
            });

            elements.forEach(element => {
                element.classList.remove("closest-left", "closest-right");
            });

            containers.forEach(container => {
            container.classList.remove("containerAppend");
            });

            if (closestLeftElement || closestRightElement) {

                // Add highlighting to the closest elements on the same row
                if (closestLeftElement) {
                    closestLeftElement.classList.add("closest-left");
                }
                if (closestRightElement) {
                    closestRightElement.classList.add("closest-right");
                }

            } else if(overCat.childNodes.length === 0) {
                overCat.classList.add("containerAppend");
                // console.log("HMMM");
            }
            
        });

        container.addEventListener('dragend', event => {

            // console.log(overCat);
            // console.log(overCat.childNodes.length);\
            // console.log(dragging);
            
            draggingCat = dragging.parentElement
            draggingInd = dragging.getAttribute("card-id")

            // console.log(draggingInd);
            // console.log(draggingCat);
            // console.log(overCat);
            



            // Track the closest element to the mouse cursor
            closestElement = null;
            closestDistance = Number.MAX_SAFE_INTEGER;

            let cardAdded = false;
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const elementY = rect.top + rect.height / 2;

                // console.log(mouseX, mouseY);

                const distance = Math.sqrt((mouseX - elementX) ** 2 + (mouseY - elementY) ** 2);

                const safetyOffset = 200; // Define the safety offset distance

                // Modify the distance calculation to consider the safety offset
                
                if (distance < closestDistance && mouseY >= rect.top && mouseY <= rect.bottom  && element.parentElement.id === overCat.id) {
                    closestElement = element;
                    closestDistance = distance;
                    // console.log(closestElement);
                }
                
            });

                if (closestElement) {

                    let draggingCatArray = containerIdToArray(draggingCat.id)
                    // console.log(draggingCatArray)
                    let draggingItem = draggingCatArray[draggingInd];
                    // console.log(draggingItem);

                    const elementRect = closestElement.getBoundingClientRect();
                    const elementCenterX = elementRect.left + elementRect.width / 2;

                    // console.log(closestElement);
                    

                    let closestItemIndex = Number(closestElement.getAttribute("card-id"))

                    let overCatArray = containerIdToArray(overCat.id)
                    let closestItem = overCatArray[closestItemIndex]


                    if (mouseX < elementCenterX && closestElement.parentElement === overCat) {
                        console.log("inserting before");
                        console.log(`inserting at index ${closestItemIndex}`);
                        const draggingClone = dragging.cloneNode(true);
                        if (draggingCat === collectionCards && overCat === deckCards) {
                            // console.log("TEST1");
                            // Duplicate when dragging from collection to hand
                            overCat.insertBefore(draggingClone, closestElement);
                            overCatArray.insertBeforeItem(closestItem, draggingItem);
                            cardAdded = true;

                            
                        } else if (draggingCat === overCat) {
                            // console.log("TEST2");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            overCat.insertBefore(draggingClone, closestElement);
                            overCatArray.insertBeforeItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (draggingCat === deckCards && overCat === handCards || draggingCat === collectionCards && overCat === handCards) {
                            // console.log("TEST3");
                            overCat.insertBefore(draggingClone, closestElement);
                            overCatArray.insertBeforeItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (!(draggingCat === collectionCards && overCat === deckCards) || !(draggingCat === deckCards && overCat === handCards)) {
                            // console.log("TEST4");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            cardAdded = true;

                        }
                    } else if (closestElement.parentElement === overCat) {
                        console.log("inserting after");
                        console.log(`inserting at index ${closestItemIndex}`);
                        const draggingClone = dragging.cloneNode(true);
                        if (draggingCat === collectionCards && overCat === deckCards) {
                            // console.log("TEST1");
                            // Duplicate when dragging from collection to hand
                            insertAfter(draggingClone, closestElement);
                            overCatArray.insertAfterItem(closestItem, draggingItem);
                            cardAdded = true;

                            
                        } else if (draggingCat === overCat) {
                            // console.log("TEST2");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            insertAfter(draggingClone, closestElement);
                            overCatArray.insertAfterItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (draggingCat === deckCards && overCat === handCards || draggingCat === collectionCards && overCat === handCards) {
                            // console.log("TEST3");
                            insertAfter(draggingClone, closestElement);
                            overCatArray.insertAfterItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (!(draggingCat === collectionCards && overCat === deckCards) || !(draggingCat === deckCards && overCat === handCards)) {
                            // console.log("TEST4");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            cardAdded = true;

                        }
                    }
                } else {
                    let draggingCatArray = containerIdToArray(draggingCat.id);
                    // console.log(draggingCatArray);
                    // console.log("APPEND");
                    let draggingItem = draggingCatArray[draggingInd];
                    let overCatArray = containerIdToArray(overCat.id);
                    if (draggingCat != collectionCards && (draggingCat != handCards && overCat == deckCards)) {
                        // Remove when dragging into any container but collection
                        dragging.parentElement.removeChild(dragging);
                        draggingCatArray.deleteItem(draggingItem);
                    } 
                    overCatArray.push(draggingItem);
                    const draggingClone = dragging.cloneNode(true);
                    overCat.append(draggingClone);
                    cardAdded = true;

                }

                if (clone) {
                    // Remove the clone as the touch has ended
                    clone.parentNode.removeChild(clone);
                    clone = null;
                    // Handle the drop logic here
                }

                    // console.table(hand)
                    // console.table(deck)
                    // console.table(collection)
                    



                updateCardIds(containers)
                applyEventListeners()
                saveCards()

            });
        })

        // Mobile Drag and Drop
        

        cardsDisplay.addEventListener('touchstart', function(e) {
            e.preventDefault();
            overCat = null
            const target = e.target.closest('.draggable'); // Ensure we're touching a draggable item
            if (target) {
                clone = target.cloneNode(true); // Clone the target element
                clone.className = 'card dragging-clone'; // Reset class list to only 'dragging-clone'
                clone.style.position = 'absolute';
                clone.style.opacity = '1';
                // Initially, don't append the clone to the document to avoid flickering
            }
            
        });

        cardsDisplay.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (dragging) {
            
            if (clone) {
                const touch = e.touches[0];
                // Position the clone at the touch location
                clone.style.left = `${touch.clientX + window.scrollX - clone.offsetWidth / 2}px`;
                clone.style.top = `${touch.clientY + window.scrollY - clone.offsetHeight / 2}px`;
                // Append the clone to the body if it hasn't been already
                if (!clone.parentNode) {
                    cardsDisplay.appendChild(clone);
                }
            }
            // Select all elements you want to track
            elements = document.querySelectorAll('.draggable:not(.dragging)');

            // console.log(overCat);

            const lastTouch = e.changedTouches[0];
            const endX = lastTouch.clientX;
            const endY = lastTouch.clientY;
            
            let mouseX = e.changedTouches[0].clientX;
            let mouseY = e.changedTouches[0].clientY;
            let elementFromPoint = document.elementFromPoint(endX, endY)

            // console.log(document.elementFromPoint(endX, endY));
            // console.log(findAncestorWithClass(elementFromPoint, "container"));

            if (findAncestorWithClass(elementFromPoint, "container") != null) {
                overCat = findAncestorWithClass(elementFromPoint, "container")
            } else {
                overCat = null
            }



            let closestLeftElement = null;
            let closestRightElement = null;
            let closestLeftDistance = Number.MAX_SAFE_INTEGER;
            let closestRightDistance = Number.MAX_SAFE_INTEGER;
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - elementX);

                // Update closest element on the left side
                if (mouseX > elementX && distance < closestLeftDistance && mouseY >= rect.top && mouseY <= rect.bottom && element.parentElement.id === overCat.id) {
                    closestLeftElement = element;
                    closestLeftDistance = distance;
                }
                
                if (mouseX < elementX && distance < closestRightDistance && mouseY >= rect.top && mouseY <= rect.bottom && element.parentElement.id === overCat.id) {
                    closestRightElement = element;
                    closestRightDistance = distance;
                }
            });

            elements.forEach(element => {
                element.classList.remove("closest-left", "closest-right");
            });

            containers.forEach(container => {
            container.classList.remove("containerAppend");
            });

            if (closestLeftElement || closestRightElement && overCat != null) {

                // Add highlighting to the closest elements on the same row
                if (closestLeftElement) {
                    closestLeftElement.classList.add("closest-left");
                }
                if (closestRightElement) {
                    closestRightElement.classList.add("closest-right");
                }
            } else if(overCat != null && overCat.childNodes.length === 0) {
                overCat.classList.add("containerAppend");
                // console.log("HMMM");
            }
        }
        });

        cardsDisplay.addEventListener('touchend', function(e) {

            if (dragging) {
            e.preventDefault();
            // Your code here
            draggingCat = dragging.parentElement
            draggingInd = dragging.getAttribute("card-id")

            // console.log(draggingInd);
            // console.log(draggingCat);
            // console.log(overCat);

            

            let cardAdded = false;
            
            if (clone) {
                // Remove the clone as the touch has ended
                clone.parentElement.removeChild(clone);
                clone = null;
                // Handle the drop logic here
            }


            // Track the closest element to the mouse cursor
            closestElement = null;
            closestDistance = Number.MAX_SAFE_INTEGER;
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const elementY = rect.top + rect.height / 2;
                mouseX = e.changedTouches[0].clientX;
                mouseY = e.changedTouches[0].clientY;

                const distance = Math.sqrt((e.changedTouches[0].clientX - elementX) ** 2 + (e.changedTouches[0].clientY - elementY) ** 2);

                const safetyOffset = 200; // Define the safety offset distance

                // Modify the distance calculation to consider the safety offset
                if (distance < closestDistance && mouseY >= rect.top && mouseY <= rect.bottom  && element.parentElement.id === overCat.id) {
                    closestElement = element;
                    closestDistance = distance;
                }
                
            });

                if (overCat != null && closestElement) {

                    let draggingCatArray = containerIdToArray(draggingCat.id)
                    // console.log(draggingCatArray)
                    let draggingItem = draggingCatArray[draggingInd];
                    // console.log(draggingItem);

                    const elementRect = closestElement.getBoundingClientRect();
                    const elementCenterX = elementRect.left + elementRect.width / 2;

                    let closestItemIndex = Number(closestElement.getAttribute("card-id"))

                    let overCatArray = containerIdToArray(overCat.id)
                    let closestItem = overCatArray[closestItemIndex]


                    if (mouseX < elementCenterX && closestElement.parentElement === overCat) {
                        console.log("inserting before");
                        console.log(`inserting at index ${closestItemIndex}`);
                        const draggingClone = dragging.cloneNode(true);
                        if (draggingCat === collectionCards && overCat === deckCards) {
                            // console.log("TEST1");
                            // Duplicate when dragging from collection to hand
                            overCat.insertBefore(draggingClone, closestElement);
                            overCatArray.insertBeforeItem(closestItem, draggingItem);
                            cardAdded = true;
                            
                        } else if (draggingCat === overCat) {
                            // console.log("TEST2");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            overCat.insertBefore(draggingClone, closestElement);
                            overCatArray.insertBeforeItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (draggingCat === deckCards && overCat === handCards || draggingCat === collectionCards && overCat === handCards) {
                            // console.log("TEST3");
                            overCat.insertBefore(draggingClone, closestElement);
                            overCatArray.insertBeforeItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (!(draggingCat === collectionCards && overCat === deckCards) || !(draggingCat === deckCards && overCat === handCards)) {
                            // console.log("TEST4");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            cardAdded = true;
                        }
                    } else if (closestElement.parentElement === overCat) {
                        console.log("inserting after");
                        console.log(`inserting at index ${closestItemIndex}`);
                        const draggingClone = dragging.cloneNode(true);
                        if (draggingCat === collectionCards && overCat === deckCards) {
                            // console.log("TEST1");
                            // Duplicate when dragging from collection to hand
                            insertAfter(draggingClone, closestElement);
                            overCatArray.insertAfterItem(closestItem, draggingItem);
                            cardAdded = true;

                            
                        } else if (draggingCat === overCat) {
                            // console.log("TEST2");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            insertAfter(draggingClone, closestElement);
                            overCatArray.insertAfterItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (draggingCat === deckCards && overCat === handCards || draggingCat === deckCards && overCat === handCards || draggingCat === collectionCards && overCat === handCards) {
                            // console.log("TEST3");
                            insertAfter(draggingClone, closestElement);
                            overCatArray.insertAfterItem(closestItem, draggingItem);
                            cardAdded = true;


                        } else if (!(draggingCat === collectionCards && overCat === deckCards) || !(draggingCat === deckCards && overCat === handCards)) {
                            // console.log("TEST4");
                            draggingCatArray.deleteItem(draggingItem);
                            dragging.parentElement.removeChild(dragging);
                            cardAdded = true;

                        }
                    }
                } else if (overCat != null) {
                    let draggingCatArray = containerIdToArray(draggingCat.id);
                    console.log(draggingCatArray);
                    console.log("APPEND");
                    let draggingItem = draggingCatArray[draggingInd];
                    let overCatArray = containerIdToArray(overCat.id);
                    if (draggingCat != collectionCards && (draggingCat != handCards && overCat == deckCards)) {
                        // Remove when dragging into any container but collection
                        dragging.parentElement.removeChild(dragging);
                        draggingCatArray.deleteItem(draggingItem);
                    } 
                    overCatArray.push(draggingItem);
                    const draggingClone = dragging.cloneNode(true);
                    overCat.append(draggingClone);
                    cardAdded = true;

                }

                    console.table(hand)
                    console.table(deck)
                    console.table(collection)
                    



                updateCardIds(containers)
                applyEventListeners()
                saveCards()
            }
        });

        
    
}

function updateCardIds(containers) {
    containers.forEach(container => {
        container.classList.remove('containerAppend');
        const cards = container.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.setAttribute('card-id', index);
            card.classList.remove('closest-left');
            card.classList.remove('closest-right');
        });
    });
}

function createCard() {
    let cardName  = document.getElementById("cardNameIn").value
    let cardDesc = document.getElementById("cardDescIn").value
    let cardCat = document.getElementById("cardCatIn").value
    let cardColor = document.getElementById("cardColorIn").value
    let cardNumber = document.getElementById("cardNmbrIn").value
    let cardSymbol = document.getElementById("cardSymIn").value

    console.log(cardColor);


    let newCard = new Card(cardName, cardDesc, cardCat, cardColor, cardSymbol, cardNumber)
    collection.push(newCard)
    displayCards()
    saveCards()

    // console.log(collection);
}

function containerIdToArray(cat) {
    switch(cat) {
        case "collectionCards":
            return collection
        case "deckCards":
            return deck
        case "handCards":
            return hand
        
    }
}

function findAncestorWithClass(element, className) {
    while (element && element !== document.body) {
        if (element.classList.contains(className)) {
            return element;
        }
        element = element.parentElement;
    }
    return null; // Return null if no element with the class is found
}

function deleteCard() {
    let cardCat = selectedCardContextMenu.parentElement.id
    let cardInd = selectedCardContextMenu.getAttribute("card-id")

    console.log(cardCat, cardInd);

    let cardArray = containerIdToArray(cardCat)
    cardArray.splice(cardInd, 1)
    displayCards()
    // console.table(hand)
    // console.table(deck)
    // console.table(collection)
    saveCards()

}

function downloadFile(file, text) {

    //creating an invisible element

    let element = document.createElement('a');
    element.setAttribute('href',
        'data:text/plain;charset=utf-8, '
        + encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
}

// Start file download.

document.getElementById("saveFileBtn")
    .addEventListener("click", function () {
        let text = localStorage.getItem("cardSave");
        let filename = "ODBSave.json";

        downloadFile(filename, text);
    }, false);

    function handleFileSelect(event) {
        const files = event.target.files; // This will be a FileList of all selected files
        if (files.length > 0) {
            const file = files[0];
            // Now you can do something with the file, e.g., read it
            const reader = new FileReader();
            reader.onload = function(e) {
                // e.target.result contains the file's content 
                localStorage.setItem("cardSave", e.target.result);
                loadCards();
            };
            reader.readAsText(file); // Read the file as text
        }
    }
    
    // Function to trigger file upload on button click
    function setupUploadButton(buttonId) {
        // Create a hidden file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileSelect);
        document.body.appendChild(fileInput);
    
        // Add click event listener to the button
        document.getElementById(buttonId).addEventListener('click', function() {
            fileInput.click(); // Trigger the hidden file input click
        });
    }
    
    // Setup upload functionality on any button by passing its ID
    setupUploadButton("loadFileBtn");

    

creationButton.addEventListener("click", createCard)
cmDelete.addEventListener("click", deleteCard)

creationModalBtn.addEventListener("click", () => creationModal.style.display = "grid")

creationModal.addEventListener("click", (e) => {
    if (e.target == creationModal) {
        creationModal.style.display = "none"
    }
})

settingsModalBtn.addEventListener("click", () => settingsModal.style.display = "grid")

settingsModal.addEventListener("click", (e) => {
    if (e.target == settingsModal) {
        settingsModal.style.display = "none"
    }
})

settingsBgColor.addEventListener("input", function(e) {
    console.log(settingsBgColor.value);
    localStorage.setItem("bgColor", settingsBgColor.value);
    loadBgColor();
});




document.addEventListener("click", () => cardContextMenu.style.visibility = "hidden");


