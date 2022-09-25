let canvas

let width = 30
let height = 15

let cell_size = 30
let cell_border = 5
let font_size = 15
let cell_list = {}
let loading_text
let keymap

let player = {
    coords: [0, 0],
    orientation: 0,
    up_key: 'w',
    down_key: 's',
    left_key: 'a',
    right_key: 'd'
}

let key_list = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"]

window.onload = function () {
    canvas = new fabric.StaticCanvas("playfield", {
        backgroundColor: 'rgb(100,100,200)',
    })
    loading_text = document.getElementById("loading_text")
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
    if(cell_list[player.coords[0] * width + player.coords[1]] === undefined){
        if(player.coords[0] < width){
            console.log("Game Over")
            return
        }
        if(player.coords[0] - 1 !== undefined){
            generate_playfield(generate_rand_int(15))
            return
        }
        console.log("Game Over")
        return
    }
    cell_list[player.coords[0] * width + player.coords[1]][0].set('fill', 'green')

    if (event.key === player.up_key) {
        player.up_key = cell_list[player.coords[0] * width + player.coords[1]][1].text
    } else if (event.key === player.down_key) {
        player.down_key = cell_list[player.coords[0] * width + player.coords[1]][1].text
    } else if (event.key === player.left_key) {
        player.left_key = cell_list[player.coords[0] * width + player.coords[1]][1].text
    } else if (event.key === player.right_key) {
        player.right_key = cell_list[player.coords[0] * width + player.coords[1]][1].text
    }
    keymap.innerText = `${player.up_key} \n ${player.left_key} ${player.down_key} ${player.right_key}`
    canvas.renderAll()
    // console.log('changing coords: ', player.coords, ', cell_list: ', cell_list[player.coords[0] * width + player.coords[1]][0])
    // cell_list[player.coords[0] * width + player.coords[1]][0].set('fill', 'green')
})

function generate_rand_int(n) {
    return Math.floor(Math.random() * n)
}

function clearCanvas(){
    canvas.clear()
    cell_list = []
    canvas.set('backgroundColor', 'rgb(100,100,200)')
}

function generate_playfield(y = 0) {
    console.log("generating playfield starting at ", 0, y)
    clearCanvas()
    let loading_text = new fabric.Text("Loading next level...",{
        originX: 'center',
        originY: 'center',
        left: 0.5 * canvas.width,
        top: 0.5 * canvas.height
    })
    canvas.add(loading_text)
    canvas.renderAll()

    let current_coord = [0, y]
    player.coords = [0, y]

    while (current_coord[0] < width) {
        if (cell_list[current_coord[1] * width + current_coord[0]] === undefined) {
            add_cell(current_coord[0], current_coord[1])
        }
        if (generate_rand_int(10) > 6 && current_coord[0] + 1 < width && cell_list[(current_coord[0] + 1) * width + current_coord[1]] === undefined) {
            add_cell(current_coord[0] + 1, current_coord[1])
        }
        if (generate_rand_int(10) > 6 && current_coord[1] + 1 < height && cell_list[current_coord[0] * width + (current_coord[1] + 1)] === undefined) {
            add_cell(current_coord[0], current_coord[1] + 1)
        }
        if (generate_rand_int(10) > 6 && current_coord[0] - 1 > -1 && cell_list[(current_coord[0] * width - 1) + current_coord[1]] === undefined) {
            add_cell(current_coord[0] - 1, current_coord[1])
        }
        if (generate_rand_int(10) > 6 && current_coord[1] - 1 > -1 && cell_list[current_coord[0] * width + (current_coord[1] - 1)] === undefined) {
            add_cell(current_coord[0], current_coord[1] - 1)
        }

        cell_list[player.coords[0] * width + player.coords[1]][0].set('fill', 'green')

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

    canvas.remove(loading_text)
    canvas.renderAll()
}

function add_cell(x, y) {
    cell_list[x * width + y] = [
        new fabric.Rect({
            left: cell_border + x * (cell_size + cell_border),
            top: cell_border + y * (cell_size + cell_border),
            fill: 'grey',
            width: cell_size,
            height: cell_size,
        }),
        new fabric.Text(key_list[generate_rand_int(key_list.length)], {
            left: cell_border + x * (cell_size + cell_border) + (cell_size - font_size) / 2,
            top: cell_border + y * (cell_size + cell_border) + (cell_size - font_size) / 2,
            fontSize: font_size,
            textAlign: 'center'
        })
    ]
    canvas.add(cell_list[width * x + y][0], cell_list[width * x + y][1])
    canvas.renderAll()
}
