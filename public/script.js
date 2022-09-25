let canvas

let width = 15
let height = 13

let cell_width = 60
let cell_height = 40
let cell_border = 5
let cell_list = {}
let loading_text
let keymap
let frog

let player = {
    coords: [0, 0],
    orientation: 2,
    up_key: 'w',
    down_key: 's',
    left_key: 'a',
    right_key: 'd'
}

let key_list = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]

window.onload = function () {
    canvas = new fabric.StaticCanvas("playfield", {
        backgroundColor: 'rgb(100,100,200)',
    })
    loading_text = document.getElementById("loading_text")
    loading_text.style.display = 'inline'
    keymap = document.getElementById("keymap")

    keymap.innerText = `${player.up_key} \n ${player.left_key} ${player.down_key} ${player.right_key}`
}

window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    console.log(event.key)
    cell_list[player.coords[0] * width + player.coords[1]][0].set('fill', 'grey')
    if (event.key === player.up_key) {
        player.coords[1]--
        player.orientation = 0
    } else if (event.key === player.down_key) {
        player.coords[1]++
        player.orientation = 2
    } else if (event.key === player.left_key) {
        player.coords[0]--
        player.orientation = 3
    } else if (event.key === player.right_key) {
        player.coords[0]++
        player.orientation = 1
    }
    if (cell_list[player.coords[0] * width + player.coords[1]] === undefined) {
        if (player.coords[0] < width) {
            console.log("Game Over1")
            loading_text.textContent = "Game Over"
            return
        }
        if (player.coords[0] - 1 !== undefined) {
            generate_playfield()
            return
        }
        console.log("Game Over2")
        loading_text.textContent = "Game Over"
        return
    }

    draw_frog()

    if (event.key === player.up_key) {
        player.up_key = cell_list[player.coords[0] * width + player.coords[1]][1]
    } else if (event.key === player.down_key) {
        player.down_key = cell_list[player.coords[0] * width + player.coords[1]][1]
    } else if (event.key === player.left_key) {
        player.left_key = cell_list[player.coords[0] * width + player.coords[1]][1]
    } else if (event.key === player.right_key) {
        player.right_key = cell_list[player.coords[0] * width + player.coords[1]][1]
    }
    keymap.innerText = `${player.up_key} \n ${player.left_key} ${player.down_key} ${player.right_key}`
    canvas.renderAll()
    // console.log('changing coords: ', player.coords, ', cell_list: ', cell_list[player.coords[0] * width + player.coords[1]][0])
    // cell_list[player.coords[0] * width + player.coords[1]][0].set('fill', 'green')
})

function generate_rand_int(n) {
    return Math.floor(Math.random() * n)
}

function clearCanvas() {
    canvas.clear()
    cell_list = []
    if(frog)
        frog = undefined
    loading_text.textContent = ''
    canvas.set('backgroundColor', 'rgb(100,100,200)')
}

function draw_frog(){
    console.log("drawing frog")
    let frog_img_url = './Static Frogs/'

    switch(player.orientation){
        case 0:
            frog_img_url += 'back.png'
            break
        case 1:
            frog_img_url += 'right.png'
            break
        case 2:
            frog_img_url += 'Front.png'
            break
        case 3:
            frog_img_url += 'left.png'
    }
    if(frog === undefined) {
        new fabric.Image.fromURL(frog_img_url, (oImg) => {
            frog = oImg
            oImg.set({
                left: cell_border + player.coords[0] * (cell_width + cell_border),
                top: cell_border + player.coords[1] * (cell_height + cell_border) - 20,
            })
            oImg.scaleToWidth(cell_width)
            canvas.add(oImg)
            canvas.bringToFront(oImg)
            canvas.renderAll()
        })
    }
    else {
        frog.set({
            left: cell_border + player.coords[0] * (cell_width + cell_border),
            top: cell_border + player.coords[1] * (cell_height + cell_border) - 20,
        })
        frog.setSrc(frog_img_url, (oImg)=>{
            frog = oImg
            canvas.renderAll()
        })
    }
}

function generate_playfield() {
    let y = generate_rand_int(height)
    console.log("generating playfield starting at ", 0, )
    clearCanvas()
    let loading_text = new fabric.Text("Loading next level...", {
        originX: 'center',
        originY: 'center',
        left: 0.5 * canvas.width,
        top: 0.5 * canvas.height
    })
    canvas.add(loading_text)
    canvas.renderAll()

    let current_coord = [0, y]
    player.coords = [0, y]

    let temp_coords = []

    while (current_coord[0] < width) {
        if (cell_list[current_coord[1] * width + current_coord[0]] === undefined) {
            temp_coords.push([current_coord[0], current_coord[1]])
        }
        if (generate_rand_int(10) > 6 && current_coord[0] + 1 < width - 1) {
            temp_coords.push([current_coord[0] + 1, current_coord[1]])
        }
        if (generate_rand_int(10) > 6 && current_coord[1] + 1 < height - 1) {
            temp_coords.push([current_coord[0], current_coord[1] + 1])
        }
        if (generate_rand_int(10) > 6 && current_coord[0] - 1 > -1) {
            temp_coords.push([current_coord[0] - 1, current_coord[1]])
        }
        if (generate_rand_int(10) > 6 && current_coord[1] - 1 > -1) {
            temp_coords.push([current_coord[0], current_coord[1] - 1])
        }

        let last_coords = []
        last_coords[0] = current_coord[0]
        last_coords[1] = current_coord[1]
        do {
            current_coord[0] = last_coords[0]
            current_coord[1] = last_coords[1]
            let direction = generate_rand_int(6)
            switch (direction) {
                case 0:
                    current_coord[0]--
                    break
                case 1:
                case 2:
                    current_coord[0]++
                    break
                case 3:
                    current_coord[1]--
                    break
                case 4:
                    current_coord[1]++
            }
        } while (current_coord[0] < 0 || current_coord[1] < 0 || current_coord[1] >= height)
    }
    temp_coords.sort((a, b) => {
        return a[0] - b[0]
    })
    for(let i = 0; i < temp_coords.length; i++){
        add_cell(temp_coords[i][0], temp_coords[i][1])
    }

    canvas.remove(loading_text)
    draw_frog()
    canvas.renderAll()
}

function add_cell(x, y) {
    if(cell_list[x * width + y] !== undefined)
        return
    let key = key_list[generate_rand_int(key_list.length)]
    new fabric.Image.fromURL(`./Keys/${key.toUpperCase()}.png`, (oImg) => {
        oImg.set({
            left: cell_border + x * (cell_width + cell_border),
            top: cell_border + y * (cell_height + cell_border),
        })
        oImg.scaleToWidth(cell_width, true)
        cell_list[x * width + y] = [oImg, key]
        canvas.add(cell_list[width * x + y][0])
    })
}
