/**
 * Tests for SearchBar component
 */

import { render, screen } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  it('should render with default placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />)

    const input = screen.getByPlaceholderText('Search surahs or hadiths...')
    expect(input).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="Custom placeholder"
      />
    )

    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toBeInTheDocument()
  })

  it('should display the current value', () => {
    render(<SearchBar value="test query" onChange={() => {}} />)

    const input = screen.getByDisplayValue('test query')
    expect(input).toBeInTheDocument()
  })

  it('should call onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('Search surahs or hadiths...')
    await user.type(input, 'a')

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should call onChange with input value', async () => {
    const user = userEvent.setup()
    let currentValue = ''
    const onChange = jest.fn((value: string) => {
      currentValue = value
    })

    render(<SearchBar value={currentValue} onChange={onChange} />)

    const input = screen.getByPlaceholderText('Search surahs or hadiths...')
    await user.type(input, 'a')

    // Should be called with the typed character
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('should handle empty input', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<SearchBar value="test" onChange={onChange} />)

    const input = screen.getByDisplayValue('test')
    await user.clear(input)

    expect(onChange).toHaveBeenCalled()
  })

  it('should be accessible', () => {
    const { container } = render(<SearchBar value="" onChange={() => {}} />)

    const input = container.querySelector('input[type="text"]')
    expect(input).toBeInTheDocument()
  })
})
