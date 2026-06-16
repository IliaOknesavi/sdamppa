#include "generic.h"
#include <stdio.h>
#include <stdlib.h>

GenericList *createList(size_t elem_size) {
    GenericList *list = (GenericList *) malloc(sizeof(GenericList));
    if (list == NULL) {
        printf("Memory allocation failed!\n");
        exit(EXIT_FAILURE);
    }
    list->head = NULL;
    list->elem_size = elem_size;
    return list;
}

void appendItem(GenericList *list, void *data) {
    if (list == NULL || data == NULL) return; // O(1)
    Node *node = (Node *) malloc(sizeof(Node)); // O(1)
    if (node == NULL) {
        printf("Memory allocation failed!\n");
        exit(EXIT_FAILURE);
    }
    node->data = malloc(list->elem_size); // O(1)
    if (node->data == NULL) {
        free(node);
        printf("Memory allocation failed!\n");
        exit(EXIT_FAILURE);
    }
    memcpy(node->data, data, list->elem_size); // O(1)
    node->next = NULL; // O(1)
    if (list->head == NULL) { // O(1)
        list->head = node; // O(1)
    } else {
        Node *current = list->head; // O(1)
        while (current->next != NULL) { // O(n) проход до хвоста
            current = current->next; // O(1)
        }
        current->next = node; // O(1)
    }
    /*
    O: O(n) из-за обхода до конца
    Θ: Θ(n)
    Ω: Ω(1) при пустом списке
    */
}

int findItem(GenericList *list, void *value, EqualsFunc cmp) {
    if (list == NULL || value == NULL || cmp == NULL) return -1; // O(1)

    Node *current = list->head; // O(1)
    int index = 0;              // O(1)
    while (current != NULL) {   // O(n) итераций
        if (cmp(current->data, value)) { // O(1)
            return index;                // O(1)
        }
        current = current->next; // O(1)
        index++;                 // O(1)
    }
    return -1; // O(1)
    /*
    O: O(n)
    Θ: Θ(n)
    Ω: Ω(1) если совпадение в голове
    */
}

void *popItem(GenericList *list, size_t index) {
    if (list == NULL || list->head == NULL) return NULL; // O(1)

    Node *current = list->head; // O(1)
    Node *previous = NULL; // O(1)
    size_t i = 0; // O(1)
    while (current != NULL && i < index) { // O(index) итераций
        previous = current; // O(1)
        current = current->next; // O(1)
        i++; // O(1)
    }
    if (current != NULL && i == index) { // O(1)
        void *data_copy = malloc(list->elem_size); // O(1)
        if (data_copy == NULL) {
            printf("Memory allocation failed!\n");
            exit(EXIT_FAILURE);
        }
        memcpy(data_copy, current->data, list->elem_size); // O(1)
        if (previous == NULL) { // O(1)
            list->head = current->next; // O(1)
        } else {
            previous->next = current->next; // O(1)
        }
        free(current->data); // O(1)
        free(current); // O(1)
        return data_copy; // O(1)
    }
    return NULL; // O(1)
    /*
    O: O(n) из-за прохода до index
    Θ: Θ(index + 1)
    Ω: Ω(1) при index == 0
    */
}

void freeList(GenericList *list) {
    if (list == NULL) return;

    Node *current = list->head;
    while (current != NULL) {
        Node *next = current->next;
        free(current->data);
        free(current);
        current = next;
    }
    free(list);
}

unsigned int listLength(GenericList *list) {
    if (list == NULL) return 0; // O(1)

    Node *current = list->head; // O(1)
    size_t length = 0; // O(1)
    while (current != NULL) { // O(n) итераций
        length++; // O(1)
        current = current->next; // O(1)
    }
    return length; // O(1)
    /*
    O: O(n)
    Θ: Θ(n)
    Ω: Ω(1) при пустом списке
    */
}
