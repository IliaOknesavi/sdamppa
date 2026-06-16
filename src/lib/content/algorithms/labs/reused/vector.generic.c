#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "generic.h"

#include <stdbool.h>

// Вспомогательная функция для изменения размера
static bool needToResize(Vector *vector, bool *increase) {
    if (vector->size >= vector->capacity) {
        if (increase != NULL) {
            *increase = true;
        }
        return true;
    }
    if (vector->size <= vector->capacity / 4 && vector->capacity > MIN_SIZE) {
        if (increase != NULL) {
            *increase = false;
        }
        return true;
    }
    return false;
}

// Определяем увеличивать размер или уменьшать
static int resize(Vector *vector, bool increase) {
    if (vector == NULL) {
        return 0;
    }
    size_t capacity = vector->capacity;
    size_t new_capacity = increase ? capacity * 2 : capacity / 2;
    if (new_capacity < MIN_SIZE) {
        new_capacity = MIN_SIZE;
    }

    void *new_data = realloc(vector->data, vector->elem_size * new_capacity);
    if (new_data == NULL) {
        return 0;
    }

    vector->data = new_data;
    vector->capacity = new_capacity;
    if (vector->size > vector->capacity) {
        vector->size = vector->capacity;
    }
    return 1;
}

Vector *createVector(size_t elem_size) {
    if (elem_size <= 0) {
        return NULL;
    }
    Vector *vector = (Vector *) malloc(sizeof(Vector));
    if (vector == NULL) {
        return NULL;
    }
    vector->elem_size = elem_size;
    vector->size = 0;
    vector->capacity = MIN_SIZE;
    vector->data = malloc(elem_size * vector->capacity);
    if (vector->data == NULL) {
        free(vector);
        return NULL;
    }
    return vector;
}

int appendVectorItem(Vector *vector, void *el) {
    if (vector == NULL || el == NULL) { // O(1)
        return -1; // O(1)
    }
    bool increase; // O(1)
    if (needToResize(vector, &increase)) { // O(1) + возможный resize O(n)
        if (!resize(vector, increase)) {   // O(n) при перераспределении
            return -1; // O(1)
        }
    }
    memcpy((char *) vector->data + vector->size * vector->elem_size, el, vector->elem_size); // O(1)
    vector->size += 1; // O(1)
    return 0; // O(1)
    /*
    O: O(n) в редких случаях перераспределения, амортизированно O(1)
    Θ: Θ(1) для обычной вставки без resize
    Ω: Ω(1)
    */
}

void *getVectorItem(Vector *vector, size_t index) {
    if (vector == NULL || index >= vector->size) { // O(1)
        return NULL; // O(1)
    }
    return (char *) vector->data + index * vector->elem_size; // O(1)
    /*
    O: O(1)
    Θ: Θ(1)
    Ω: Ω(1)
    */
}

int setVectorItem(Vector *vector, size_t index, void *value) {
    if (vector == NULL || index >= vector->size || value == NULL) { // O(1)
        return -1; // O(1)
    }
    memcpy(getVectorItem(vector, index), value, vector->elem_size); // O(1)
    return 0; // O(1)
    /*
    O: O(1)
    Θ: Θ(1)
    Ω: Ω(1)
    */
}

void *copyVectorItem(Vector *vector, size_t index) {
    if (vector == NULL || index >= vector->size) {
        return NULL;
    }
    void *copy = malloc(vector->elem_size);
    if (copy == NULL) {
        return NULL;
    }
    memcpy(copy, (char *) vector->data + index * vector->elem_size, vector->elem_size);
    return copy;
}

void *popVectorItem(Vector *vector, size_t index) {
    if (vector == NULL || index >= vector->size) { // O(1)
        return NULL; // O(1)
    }
    void *popped_item = malloc(vector->elem_size); // O(1)
    if (popped_item == NULL) { // O(1)
        return NULL; // O(1)
    }
    memcpy(popped_item, getVectorItem(vector, index), vector->elem_size); // O(1)
    for (size_t i = index; i < vector->size - 1; i++) { // O(n - index) итераций
        memcpy(getVectorItem(vector, i), getVectorItem(vector, i + 1), vector->elem_size); // O(1) на шаг
    }
    vector->size -= 1; // O(1)
    bool increase; // O(1)
    if (needToResize(vector, &increase)) { // O(1) + возможный resize O(n)
        if (!resize(vector, increase)) {   // O(n) при перераспределении
            free(popped_item);             // O(1)
            return NULL;                   // O(1)
        }
    }
    return popped_item; // O(1)
    /*
    O: O(n) из-за сдвига элементов (n - index) и возможного resize
    Θ: Θ(n - index)
    Ω: Ω(1) при удалении последнего элемента без сжатия
    */
}

long int findVectorItem(Vector *vector, void *value, EqualsFunc cmp) {
    if (vector == NULL || value == NULL || cmp == NULL) { // O(1)
        return -1; // O(1)
    }
    for (size_t i = 0; i < vector->size; i++) { // O(n) итераций
        void *item = getVectorItem(vector, i);  // O(1)
        if (cmp(item, value)) {                 // O(1)
            return (long int) i; // O(1)
        }
    }
    return -1; // O(1)
    /*
    O: O(n)
    Θ: Θ(n)
    Ω: Ω(1) если найден на первом элементе
    */
}

int reserveVector(Vector *vector, size_t min_capacity) {
    if (vector == NULL) {
        return -1;
    }
    if (min_capacity <= vector->capacity) {
        return 0;
    }

    size_t new_capacity = vector->capacity < MIN_SIZE ? MIN_SIZE : vector->capacity;
    while (new_capacity < min_capacity) {
        new_capacity *= 2;
    }

    void *new_data = realloc(vector->data, vector->elem_size * new_capacity);
    if (new_data == NULL) {
        return -1;
    }

    vector->data = new_data;
    vector->capacity = new_capacity;
    return 0;
}

int resizeVector(Vector *vector, size_t new_size) {
    if (vector == NULL) {
        return -1;
    }
    if (new_size > vector->capacity) {
        if (reserveVector(vector, new_size) != 0) {
            return -1;
        }
    }
    if (new_size > vector->size) {
        size_t bytes_to_zero = (new_size - vector->size) * vector->elem_size;
        memset((char *) vector->data + vector->size * vector->elem_size, 0, bytes_to_zero);
    }
    vector->size = new_size;
    bool increase;
    if (needToResize(vector, &increase) && !increase) {
        if (!resize(vector, increase)) {
            return -1;
        }
    }
    return 0;
}

int vectorFree(Vector *vector) {
    if (vector == NULL) {
        return -1;
    }
    free(vector->data);
    free(vector);
    return 0;
}

long long binarySearchVector(Vector *vector, void *key, CmpFunc cmp) {
    if (vector == NULL || key == NULL || cmp == NULL || vector->size == 0) {
        return (size_t) (-1);
    }
    long long left = -1;
    long long right = vector->size;

    while (left + 1 < right) {
        size_t mid = left + (right - left) / 2;

        void *mid_item = getVectorItem(vector, (size_t) mid);

        if (cmp(mid_item, key)) {
            left = mid;
        } else {
            right = mid;
        }
    }
    return left;
}
