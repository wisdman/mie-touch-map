
export class TimelineComponent {
  #node: HTMLElement
  #cursor: HTMLElement
  #cursorTransitionClass: string

  #items: Array<number> = []

  #dX: number = 0
  #isMove: boolean = false

  constructor({
    root, cursor, cursorTransitionClass, itemsSelector
  }: {
    root: HTMLElement | string
    cursor: HTMLElement | string
    cursorTransitionClass: string
    itemsSelector: string
  }) {
    this.#node = root instanceof HTMLElement ? root : <HTMLElement>(document.querySelector(root))
    this.#cursor = cursor instanceof HTMLElement ? cursor : <HTMLElement>(this.#node.querySelector(cursor))
    this.#cursorTransitionClass = cursorTransitionClass

    this.#items = Array.from(this.#node.querySelectorAll<HTMLElement>(itemsSelector)).map((node, i) => {
      node.addEventListener("click", () => this.click(i))
      return Math.round(node.offsetLeft + node.offsetWidth / 2)
    })
    this.#cursor.style.setProperty("--left", `${this.#items[0]}px`)

    console.log(this.#items)

    this.#cursor.addEventListener("pointerdown", this.pointerDown)
    window.addEventListener("pointermove", this.pointerMove, { passive: true })
    window.addEventListener("pointerup", this.pointerUp, { passive: true })
  }

  private pointerDown = ({offsetX}: PointerEvent) => {
    this.#dX = Math.round(offsetX - this.#cursor.offsetWidth / 2) + this.#node.offsetLeft
    this.#cursor.classList.remove(this.#cursorTransitionClass)
    this.#isMove = true 
  }

  private pointerMove = ({clientX}: PointerEvent) => {
    if (!this.#isMove) return
    this.#cursor.style.setProperty("--left", `${clientX - this.#dX}px`)
  }

  private pointerUp = () => {
    this.#isMove = false
    const x: number = Number.parseInt(getComputedStyle(this.#cursor).getPropertyValue("--left"))
    let nX: number = Infinity
    let j: number = 0
    
    for (let i = 0; i < this.#items.length; i++) {
      if (x < this.#items[i] && this.#items[i] - x < nX) {
        nX = this.#items[i] - x
        j = i
      } else if (x - this.#items[i] < nX) {
        nX = x - this.#items[i]
        j = i
      }
    }
    
    this.#cursor.classList.add(this.#cursorTransitionClass)
    this.#cursor.style.setProperty("--left", `${this.#items[j]}px`)
    //this.$emit("input", j)
  }

  private click(i: number) {
    this.#cursor.classList.add(this.#cursorTransitionClass)
    this.#cursor.style.setProperty("--left", `${this.#items[i]}px`)
  }
}
