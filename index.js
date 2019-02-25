const commonErrors = {
  1: 'Поле не может быть пустым',
  2: 'Поле может содержать только цифры'
}

const CVVErrors = {
  1: 'CVV должен состоять из 3 цифр',
  2: 'Такода CVV кода не существует'
}

const cardNumberErrors = {
  1: 'Номер карты должен состоять из 16 цифр',
  2: 'Некорректный номер карты'
}

const dateErrors = {
  1: 'Номер месяца должен иметь двузначный формат',
  2: 'Такого номера месяца не существует',
  3: 'Год должен иметь двузначный формат',
  4: 'Год окончания действия карты не может быть меньше текущего года',
  5: 'Чет слишком большой срок годности у карты'
}

function isEmpty(value) {
  if (!value) return {
    isError: true,
    errorText: commonErrors['1']
  }

  return {
    isError: false,
    errorText: ''
  }
}

function CVVValidate(cvvValue) {
    if (!cvvValue) {
      return {
        isError: false,
        errorText: ''
      }
    }

    if (Number.isNaN(Number(cvvValue))) {
      return {
        isError: true,
        errorText: commonErrors['2']
      }
    }

    if (cvvValue.length !== 3) {
      return {
        isError: true,
        errorText: CVVErrors['1']
      }
    }

    if (Number(cvvValue) <= 0) {
      return {
        isError: true,
        errorText: CVVErrors['2']
      }
    }

    return {
      isError: false,
      errorText: ''
    }
}

function cardNumberValidate(cardNumberValue) {
  if (!cardNumberValue) {
    return {
      isError: false,
      errorText: ''
    }
  }

  if (Number.isNaN(Number(cardNumberValue))) {
    return {
      isError: true,
      errorText: commonErrors['2']
    }
  }

  if (cardNumberValue.length !== 16) {
    return {
      isError: true,
      errorText: cardNumberErrors['1']
    }
  }

  if (cardNumberValue === '0000000000000000') {
    return {
      isError: true,
      errorText: cardNumberErrors['2']
    }
  }

  return {
    isError: false,
    errorText: ''
  }
}

function cardMonthValidation(cardMonthValue) {
  if (!cardMonthValue) {
    return {
      isError: false,
      errorText: ''
    }
  }

  if (Number.isNaN(Number(cardMonthValue))) {
    return {
      isError: true,
      errorText: commonErrors['2']
    }
  }

  if (cardMonthValue.length !== 2) {
    return {
      isError: true,
      errorText: dateErrors['1']
    }
  }

  if (+cardMonthValue > 12 || +cardMonthValue < 1) {
    return {
      isError: true,
      errorText: dateErrors['2']
    }
  }

  return {
    isError: false,
    errorText: ''
  }
}

function cardYearValidation(cardYearValue) {
  if (!cardYearValue) {
    return {
      isError: false,
      errorText: ''
    }
  }

  const currentYear = new Date().getFullYear().toString().slice(2)

  if (Number.isNaN(Number(cardYearValue))) {
    return {
      isError: true,
      errorText: commonErrors['2']
    }
  }
  if (cardYearValue.length !== 2) {
    return {
      isError: true,
      errorText: dateErrors['1']
    }
  }

  if (+currentYear > +cardYearValue) {
    return {
      isError: true,
      errorText: dateErrors['4']
    }
  }

  if (+cardYearValue > (+currentYear + 5)) {
    return {
      isError: true,
      errorText: dateErrors['5']
    }
  }

  return {
    isError: false,
    errorText: ''
  }
}

function renderError(tooltipDataId, error, elem) {
  const tooltip = document.querySelector(`[data-id=${tooltipDataId}]`)

  if (!tooltip) throw Error('Что-то пошло не так')

  tooltip.innerHTML = error
  tooltip.classList.add('_visible')
  tooltip.classList.remove('_hidden')

  elem.classList.add('_error')
}

function hideError(tooltipDataId, elem) {
  const tooltip = document.querySelector(`[data-id=${tooltipDataId}]`)

  if (!tooltip) throw Error('Что-то пошло не так')

  tooltip.innerHTML = ''
  tooltip.classList.remove('_visible')
  tooltip.classList.add('_hidden')

  elem.classList.remove('_error')
}

function renderNumberValue(value) {
  const valueArray = value.split('')
  const reducer = (accumulator, currentValue, index) => {
    if (index % 4 === 0) return `${accumulator} ${currentValue}`

    return `${accumulator}${currentValue}`
  }

  return valueArray.reduce(reducer)
}

function commonValidate(elem, validateFunction, tooltipDataId) {
  const elemValue = elem.value.trim()
  let elemError = validateFunction(elemValue)

  elemError = !elemError.isError && isEmpty(elemValue)

  if (elemError.isError) renderError(tooltipDataId, elemError.errorText, elem)
}

document.addEventListener('DOMContentLoaded', function () {
  const cardNumber = document.getElementById('card-number')
  const cardMonth = document.getElementById('card-month')
  const cardYear = document.getElementById('card-year')
  const cardCVV = document.getElementById('card-cvv')
  const form = document.getElementById('form')

  const cardNumberDataId = 'card-number'
  const cardCVVDataId = 'card-cvv'
  const cardMonthDataId = 'card-month'
  const cardYearDataId = 'card-year'

  if (!cardNumber || !cardMonth || !cardYear || !cardCVV) {
    throw Error('Ошибка загрузки страницы');
  }

  /* Валидация номера карты */
  cardNumber.addEventListener('blur', function () {
    const numberValue = this.value.replace(/\s/g, '')
    const error = cardNumberValidate(numberValue)

    if (error.isError) renderError(cardNumberDataId, error.errorText, this)

    if (numberValue) this.value = renderNumberValue(numberValue)
  })

  cardNumber.addEventListener('keyup', function () {
    hideError(cardNumberDataId, this)
  })

  /*Валидация месяца действия карты*/
  cardMonth.addEventListener('blur', function () {
    const error = cardMonthValidation(this.value.trim())

    if (error.isError) renderError(cardMonthDataId, error.errorText, this)
  })

  cardMonth.addEventListener('keyup', function () {
    hideError(cardMonthDataId, this)
  })

  // /*Валидация года действия карты*/
  cardYear.addEventListener('blur', function () {
    const error = cardYearValidation(this.value.trim())

    if (error.isError) renderError(cardYearDataId, error.errorText, this)
  })

  cardYear.addEventListener('keyup', function () {
    hideError(cardYearDataId, this)
  })

  /* Валидация CVV кода */
  cardCVV.addEventListener('blur', function () {
    const error = CVVValidate(this.value.trim())

    if (error.isError) renderError(cardCVVDataId, error.errorText, this)
  })

  cardCVV.addEventListener('keyup', function () {
    hideError(cardCVVDataId, this)
  })

  form.addEventListener('submit', function (event) {
    event.preventDefault()

    commonValidate(cardNumber, cardNumberValidate, cardNumberDataId)
    commonValidate(cardMonth, cardMonthValidation, cardMonthDataId)
    commonValidate(cardYear, cardYearValidation, cardYearDataId)
    commonValidate(cardCVV, CVVValidate, cardCVVDataId)
  })
})
