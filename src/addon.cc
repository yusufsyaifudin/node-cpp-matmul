#include <node.h>
#include <v8.h>
#include <iostream>
#include "lib/eigen/Eigen/Dense"

void matrixMultiplicationEigen(const v8::FunctionCallbackInfo<v8::Value>& args) {
    // Get v8 context
    v8::Isolate* isolate = v8::Isolate::GetCurrent();
    v8::HandleScope scope(isolate);

    // callback index in first order (index start from zero), so
    // 0 = array 1
    // 1 = array 2
    // 2 = callback
    v8::Local<v8::Function> callbackIndex = v8::Local<v8::Function>::Cast(args[2]);

    // Callback function argument. There are 2 callback function argument, first is data itself, the second is error.
    int callbackArgument = 2;

    v8::Local<v8::Array> matrix1 = v8::Local<v8::Array>::Cast(args[0]); // get first array
    v8::Local<v8::Array> matrix2 = v8::Local<v8::Array>::Cast(args[1]); // get second array

    if (!matrix1->IsArray() || !matrix2->IsArray()) {
        v8::Local<v8::Value> callback[callbackArgument] = 
        { 
            v8::Null(isolate),
            v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "first and second argument must be an array"))    
        };

        callbackIndex->Call(isolate->GetCurrentContext()->Global(), callbackArgument, callback);
        return;
    }

    if (matrix1->Length() > 0) {
        v8::Local<v8::Array> tmp = v8::Local<v8::Array>::Cast(matrix1->Get(0));
        if (!tmp->IsArray()) {
            v8::Local<v8::Value> callback[callbackArgument] = 
            { 
                v8::Null(isolate),
                v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "first arguments should be in 2-dimensional array format"))    
            };
    
            callbackIndex->Call(isolate->GetCurrentContext()->Global(), callbackArgument, callback);
            return;
        }
    }

    if (matrix2->Length() > 0) {
        v8::Local<v8::Array> tmp = v8::Local<v8::Array>::Cast(matrix2->Get(0));
        if (!tmp->IsArray()) {
            v8::Local<v8::Value> callback[callbackArgument] = 
            { 
                v8::Null(isolate),
                v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "second arguments should be in 2-dimensional array format"))    
            };
    
            callbackIndex->Call(isolate->GetCurrentContext()->Global(), callbackArgument, callback);
            return;
        }
    }

    v8::Local<v8::Array> matrix1Inner = v8::Local<v8::Array>::Cast(matrix1->Get(0));
    v8::Local<v8::Array> matrix2Inner = v8::Local<v8::Array>::Cast(matrix2->Get(0));
    const uint32_t x = matrix1->Length();
    const uint32_t z = matrix1Inner->Length();
    const uint32_t y = matrix2Inner->Length();

    if (matrix2->Length() != z) {
        v8::Local<v8::Value> callback[callbackArgument] = 
        { 
            v8::Null(isolate),
            v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "number of columns in the first matrix should be the same as the number of rows in the second"))    
        };

        callbackIndex->Call(isolate->GetCurrentContext()->Global(), callbackArgument, callback);
        return;
    }

    Eigen::MatrixXd m1(x, z);
    Eigen::MatrixXd m2(matrix2->Length(), y);

    for (uint32_t i = 0; i < x; i++) {
        v8::Local<v8::Array> tmp = v8::Local<v8::Array>::Cast(matrix1->Get(i));
        for (uint32_t j = 0; j < z; j++) {
            m1(i, j) = tmp->Get(j)->NumberValue();
        }
    }
    
    for (uint32_t i = 0; i < matrix2->Length(); i++) {
        v8::Local<v8::Array> tmp = v8::Local<v8::Array>::Cast(matrix2->Get(i));
        for (uint32_t j = 0; j < y; j++) {
            m2(i, j) = tmp->Get(j)->NumberValue();
        }
    }

    // std::cout << m1 * m2 << std::endl;

    Eigen::MatrixXd p(z, z);
    p = m1 * m2;
    // variable to save product
    v8::Local<v8::Array> product = v8::Array::New(isolate, z);
    for (uint32_t i = 0; i < x; i++) {
        v8::Local<v8::Array> tmp = v8::Array::New(isolate, z);

        for (uint32_t j = 0; j < y; j++) {
            tmp->Set(j, v8::Number::New(isolate, p(i, j)));
            // std::cout << results[i][j] << "  ";  
        }

        product->Set(i, tmp);
        // std::cout << "\n";  
    }  

    v8::Local<v8::Value> callback[callbackArgument] = 
    { 
        product,
        v8::Null(isolate)      
    };

    callbackIndex->Call(isolate->GetCurrentContext()->Global(), callbackArgument, callback);

    return;
}

void Init(v8::Handle<v8::Object> exports)
{
  // function "multiply"
  NODE_SET_METHOD(exports, "multiply", matrixMultiplicationEigen);
}


NODE_MODULE(Matrix, Init)
