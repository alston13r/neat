class Options {
  private container: HTMLDivElement

  constructor(parent?: HTMLElement) {
    this.container = document.createElement('div')
    this.container.style.padding = '10px'
    this.container.style.backgroundColor = '#555'
    this.container.style.border = 'solid #444 2px'
    this.container.style.width = 'fit-content'
    this.container.style.height = 'fit-content'
    this.container.style.fontFamily = 'arial'
    this.container.style.userSelect = 'none'

    if (parent) this.appendTo(parent)
  }

  appendTo(element: HTMLElement): Options {
    element.appendChild(this.container)

    return this
  }

  appendBefore(element: HTMLElement): Options {
    element.insertAdjacentElement('beforebegin', this.container)

    return this
  }

  appendAfter(element: HTMLElement): Options {
    element.insertAdjacentElement('afterend', this.container)

    return this
  }

  appendCheckbox(title: string, callback: (toggled: boolean) => void, initial = false): Options {
    const checkboxContainer = document.createElement('div')

    const checkbox = document.createElement('input')
    checkbox.style.display = 'inline'
    checkbox.type = 'checkbox'
    checkbox.checked = initial
    checkbox.addEventListener('change', () => callback(checkbox.checked))
    checkboxContainer.appendChild(checkbox)

    const label = document.createElement('p')
    label.style.display = 'inline'
    label.innerText = title
    checkboxContainer.appendChild(label)

    this.container.appendChild(checkboxContainer)

    return this
  }

  appendSlider(title: string, callback: (value: number) => void, min: number, max: number, initial: number, step = 1): Options {
    const sliderContainer = document.createElement('div')

    const slider = document.createElement('input')
    slider.style.display = 'inline'
    slider.type = 'range'
    slider.min = min.toString()
    slider.max = max.toString()
    slider.step = step.toString()
    slider.value = initial.toString()
    sliderContainer.appendChild(slider)

    const label = document.createElement('p')
    label.style.display = 'inline'
    label.innerText = title + ` (${slider.value})`
    sliderContainer.appendChild(label)

    slider.addEventListener('change', () => {
      label.innerText = title + ` (${slider.value})`
      callback(parseInt(slider.value))
    })

    this.container.appendChild(sliderContainer)

    return this
  }

  appendButton(title: string, callback: () => void): Options {
    const buttonContainer = document.createElement('div')

    const button = document.createElement('button')
    button.style.display = 'inline'
    button.innerText = title
    button.onclick = callback
    buttonContainer.appendChild(button)

    this.container.appendChild(buttonContainer)

    return this
  }
}