'use client'
import PageTitle from '@/components/shared/PageTitle'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categoryService } from '@/services/category'
import { productService } from '@/services/product'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().nonempty("Please enter the product name"),
  price: z.coerce.number().positive("Please enter a valid price"),
  categoryId: z.string().nonempty("Please select a category"),
  status: z.coerce.number().int().positive("Please enter a valid status"),
});

const CreateProductContainer = () => {
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      categoryId: "",
      status: 1,
    },
  });

  const { handleSubmit, control } = form;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    // Generate a preview URL for the image
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };
  
  const createProduct = async (data) => {
    try {
        const formData = new FormData();

        // Convert product details to a JSON Blob
        const productDetails = {
            name: data.name,
            price: parseFloat(data.price),
            categoryId: parseInt(data.categoryId, 10),
            status: parseInt(data.status, 10),
        };

        // Append JSON data as Blob to set Content-Type as application/json
        formData.append("product_detail", new Blob([JSON.stringify(productDetails)], { type: "application/json" }));

        if (selectedFile) {
            formData.append("product_image", selectedFile);
        } else {
            throw new Error("Please upload a product image");
        }

        // Call the API without explicitly setting Content-Type in headers
        await productService.createProduct(formData);

        toast({
            title: 'Product created successfully',
            variant: 'success',
        });
        router.push('/products');
    } catch (error) {
        toast({
            title: 'Error creating product',
            variant: 'error',
            description: error.message,
        });
    }
};


  
  const onSubmit = (values) => {
    if (!selectedFile) {
      toast({
        title: "Please upload a product image",
        variant: "destructive",
      });
      return;
    }
  
    createProduct(values);
  };

  return (
    <section>
      <PageTitle>Create Product</PageTitle>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter status" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Product Image</FormLabel>
            <FormControl>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover" />
                  </div>
                )}
              </div>
            </FormControl>
            {!selectedFile && <FormMessage>Please upload a product image</FormMessage>}
          </FormItem>

          <div className="flex gap-4 pt-6">
            <Button type="submit">Create</Button>
            <Button onClick={() => productService.createProduct} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateProductContainer;
