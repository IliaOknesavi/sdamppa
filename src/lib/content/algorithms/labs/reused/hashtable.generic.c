#include "../../lab3/vector/generic.h"
#include "generic.h"
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

Node *createNode(void *key, void *val) {
    if (key == NULL || val == NULL) {
        return NULL;
    }
    Node *pair = (Node *) (malloc(sizeof(Node)));
    if (pair == NULL) {
        return NULL;
    }
    pair->key = key;
    pair->val = val;
    return pair;
}

void freeNodeVector(Vector *vector) {
    for (size_t i = 0; i < vector->size; i++) {
        Node **item = getVectorItem(vector, i);
        if (*item != SLOT_EMPTY && *item != SLOT_DELETED) {
            free((*item)->key);
            free((*item)->val);
            free(*item);
        }
    }
    vectorFree(vector);
}

int HashInt(const void *key) {
    if (key == NULL) {
        return 0;
    }
    unsigned long long v = (unsigned long long) *(const int *) key;
    return abs((int) (((1ULL << 63) - 1) * v % INT_MAX));
}

int HashString(const void *key) {
    if (key == NULL) {
        return 0;
    }
    // key - это указатель на char* (т.е. char**)
    // Сначала разыменовываем, чтобы получить саму строку
    const char *str = *(const char **) key;
    if (str == NULL) {
        return 0;
    }
    size_t hash = 5381;
    const unsigned char *ustr = (const unsigned char *) str;
    while (*ustr) {
        hash = hash * 33 + *ustr++;
    }
    return (int) hash;
}

void swap(Vector **vector1, Vector **vector2) {
    Vector *temp = *vector1;
    *vector1 = *vector2;
    *vector2 = temp;
}

// Локальная реализация fmod
static double fmod_one(double x, double y) {
    if (y == 0.0) {
        return 0.0;
    }
    double q = (double) ((long long) (x / y));
    double r = x - q * y;
    if (r < 0.0) {
        r += y;
    }
    return r;
}
#define fmod fmod_one

HashTable *createHashTable(size_t key_size, size_t val_size) {
    HashTable *hashtable = (HashTable *) malloc(sizeof(HashTable));
    if (hashtable == NULL) {
        return NULL;
    }

    hashtable->values = createVector(sizeof(Node *));
    if (hashtable->values == NULL) {
        return NULL;
    }

    if (resizeVector(hashtable->values, TABLE_MIN_SIZE) == -1) {
        freeHashTable(hashtable);
        return NULL;
    }

    memset(hashtable->values->data, 0, hashtable->values->size * hashtable->values->elem_size);

    hashtable->key_size = key_size;
    hashtable->val_size = val_size;
    hashtable->size = 0;
    hashtable->capacity = hashtable->values->size;

    if (hashtable->capacity != TABLE_MIN_SIZE) {
        freeHashTable(hashtable);
        return NULL;
    }

    return hashtable;
}

void setItemHashTable(HashTable *table, const void *key, void *data, HashFunc hash, CmpFunc cmp) {
    if (table == NULL || key == NULL || data == NULL || hash == NULL || cmp == NULL) {
        return;
    }

    if (2 * (table->size + 1) >= table->capacity) {
        rehashHashTable(table, hash, cmp);
    }

    void *key_copy = malloc(table->key_size);
    void *val_copy = malloc(table->val_size);
    if (key_copy == NULL || val_copy == NULL) {
        free(key_copy);
        free(val_copy);
        return;
    }
    memcpy((void*)key_copy, key, table->key_size);
    memcpy(val_copy, data, table->val_size);

    Node *pair = createNode(key_copy, val_copy);
    if (pair == NULL) {
        free(key_copy);
        free(val_copy);
        return;
    }

    size_t index = (size_t) (table->capacity * fmod((double) hash(key) * HASH_CONST, 1.0));
    size_t counter = 0;

    while (counter < table->capacity) {
        size_t index_new = (index + counter * counter) % table->capacity;
        Node **item = getVectorItem(table->values, index_new);

        if (*item == SLOT_EMPTY || *item == SLOT_DELETED) {
            *item = pair;
            table->size++;
            return;
        }
        if (cmp(key, (*item)->key)) {
            free((*item)->val);
            (*item)->val = val_copy;
            free(key_copy);
            free(pair);
            return;
        }
        counter += 1;
    }

    free(key_copy);
    free(val_copy);
    free(pair);

    rehashHashTable(table, hash, cmp);
    setItemHashTable(table, key, data, hash, cmp);
}

void rehashHashTable(HashTable *table, HashFunc hash, CmpFunc cmp) {
    (void) cmp; // Параметр не используется в текущей реализации
    if (table == NULL || hash == NULL) {
        return;
    }
    Vector *old_values = table->values;
    size_t new_capacity = (table->capacity == 0) ? TABLE_MIN_SIZE : table->capacity * 2;

    Vector *new_vector = createVector(sizeof(Node *));
    if (new_vector == NULL) {
        return;
    }
    if (resizeVector(new_vector, new_capacity) == -1) {
        vectorFree(new_vector);
        return;
    }
    memset(new_vector->data, 0, new_vector->size * new_vector->elem_size);

    table->values = new_vector;
    table->capacity = new_capacity;
    table->size = 0;

    for (size_t i = 0; i < old_values->size; i++) {
        Node **item_ptr = getVectorItem(old_values, i);
        if (*item_ptr != SLOT_EMPTY && *item_ptr != SLOT_DELETED) {
            Node *node_to_move = *item_ptr;

            size_t index = (size_t) (table->capacity * fmod((double) hash(node_to_move->key) * HASH_CONST, 1.0));
            size_t counter = 0;
            while (counter < table->capacity) {
                size_t index_new = (index + counter * counter) % table->capacity;
                Node **slot = getVectorItem(table->values, index_new);
                if (*slot == SLOT_EMPTY || *slot == SLOT_DELETED) {
                    *slot = node_to_move;
                    table->size++;
                    break;
                }
                counter++;
            }
        }
    }

    vectorFree(old_values);
}

void *getItemHashTable(HashTable *table, const void *key, HashFunc hash, CmpFunc cmp) {
    if (table == NULL || key == NULL || hash == NULL || cmp == NULL) {
        return NULL;
    }

    size_t index = (size_t) (table->capacity * fmod((double) hash(key) * HASH_CONST, 1.0));

    size_t counter = 0;
    while (counter < table->capacity) {
        size_t index_new = (index + counter * counter) % table->capacity;
        Node **item = getVectorItem(table->values, index_new);

        if (*item == SLOT_EMPTY) {
            return NULL;
        }
        if (*item != SLOT_DELETED && cmp(key, (*item)->key)) {
            return (*item)->val;
        }
        counter += 1;
    }
    return NULL;
}

void *popItemHashTable(HashTable *table, const void *key, HashFunc hash, CmpFunc cmp) {
    if (table == NULL || key == NULL || hash == NULL || cmp == NULL) {
        return NULL;
    }

    size_t index = (size_t) (table->capacity * fmod((double) hash(key) * HASH_CONST, 1.0));

    size_t counter = 0;
    while (counter < table->capacity) {
        size_t index_new = (index + counter * counter) % table->capacity;
        Node **item = getVectorItem(table->values, index_new);

        if (*item == SLOT_EMPTY) {
            return NULL;
        }
        if (*item != SLOT_DELETED && cmp(key, (*item)->key)) {
            void *val_copy = malloc(table->val_size);
            if (val_copy == NULL) {
                return NULL;
            }
            memcpy(val_copy, (*item)->val, table->val_size);

            free((*item)->key);
            free((*item)->val);
            free(*item);
            *item = SLOT_DELETED;
            table->size--;
            return val_copy;
        }
        counter += 1;
    }
    return NULL;
}

unsigned long int getCollisionCount(HashTable *table, HashFunc hash) {
    if (table == NULL || hash == NULL) {
        return 0;
    }
    size_t collisions = 0;

    for (size_t i = 0; i < table->values->size; i++) {
        Node **item = getVectorItem(table->values, i);
        if (*item != SLOT_EMPTY && *item != SLOT_DELETED) {
            void *key_ptr = (*item)->key;
            size_t index_ideal = (size_t) (table->capacity * fmod((double) hash(key_ptr) * HASH_CONST, 1.0));
            if (index_ideal != i) {
                collisions++;
            }
        }
    }
    return collisions;
}

void freeHashTable(HashTable *table) {
    if (table == NULL) {
        return;
    }
    freeNodeVector(table->values);
    free(table);
}
